const feedbackDao = require("../Database/feedback-dao");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");

function formatDateStrings(feedback) {
  if (feedback.created_at) {
    const createdDate = new Date(feedback.created_at);
    const formattedCreatedDate = createdDate.toISOString().split("T")[0]; // Get YYYY-MM-DD format
    feedback.created_at = formattedCreatedDate;
  }

  if (feedback.updated_at) {
    const updatedDate = new Date(feedback.updated_at);
    const formattedUpdatedDate = updatedDate.toISOString().split("T")[0]; // Get YYYY-MM-DD format
    feedback.updated_at = formattedUpdatedDate;
  }

  return feedback;
}

//FETCH ALL DATA
async function fetchAllServices() {
  try {
    const services = await feedbackDao.getAllServices();
    const offices = await feedbackDao.getAllOffices();
    const sKinds = await feedbackDao.getAllServiceKinds();

    const completeServices = services.map((service) => {
      const office = offices.find((ofc) => ofc.id === service.relatedOfficeId);
      const serviceKind = sKinds.find(
        (srvk) => srvk.id === service.serviceKindId
      );

      if (
        office !== undefined ||
        (office !== null && serviceKind !== undefined) ||
        office !== null
      ) {
        return {
          ...service,
          office: office ? office.title : null,
          serviceKind: serviceKind ? serviceKind.description : null,
        };
      }

      console.log(office);
    });

    return completeServices;
  } catch (error) {
    console.error("Error in Process:", error);
    throw new Error("Error in Process");
  }
}

async function fetchAllQuestions() {
  try {
    const questions = await feedbackDao.getAllQuestions();

    const questionWithCategorytitle = await Promise.all(
      questions.map(async (question) => {
        const category = await prisma.categories.findUnique({
          where: {
            id: question.categoryId,
          },
        });

        return {
          ...question,
          categoryTitle: category.title,
        };
      })
    );

    return questionWithCategorytitle;
  } catch (error) {
    console.error("Error in Process:", error);
    throw new Error("Error in Process");
  }
}

async function fetchAllCategories() {
  try {
    const fetchedCategories = await feedbackDao.getAllCategories();
    return fetchedCategories;
  } catch (error) {
    console.error("Error in Process:", error);
    throw new Error("Error in Process");
  }
}

async function fetchAllFeedbacks() {
  try {
    const fetchedFeedbacks = await feedbackDao.getAllFeedbacks();

    return fetchedFeedbacks;
  } catch (error) {
    console.error("Error in Process:", error);
    throw new Error("Error in Process");
  }
}

async function fetchAllOffices() {
  try {
    const fetchedOffices = await feedbackDao.getAllOffices();
    return fetchedOffices;
  } catch (error) {
    console.error("Error in Process:", error);
    throw new Error("Error in Process");
  }
}

async function fetchAllSubmitters() {
  try {
    const fetchedSubmitters = await feedbackDao.getAllSubmitters();
    return fetchedSubmitters;
  } catch (error) {
    console.error("Error in Process:", error);
    throw new Error("Error in Process");
  }
}

async function fetchAllServiceKinds() {
  try {
    const fetchedServiceKind = await feedbackDao.getAllServiceKinds();
    return fetchedServiceKind;
  } catch (error) {
    console.error("Error in Process:", error);
    throw new Error("Error in Process");
  }
}

//submit feedback
async function submitFeedback(feedbackData) {
  try {
    // Check for existing submitter based on email
    const existingSubmitter = await prisma.submitters.findFirst({
      where: {
        email: feedbackData.submitter.email,
      },
    });

    let submitter;
    if (existingSubmitter) {
      // Use the existing submitter if found
      submitter = existingSubmitter;
    } else {
      // Create a new submitter if not found
      submitter = await feedbackDao.createSubmitter({
        name: feedbackData.submitter.name,
        email: feedbackData.submitter.email,
        age: feedbackData.submitter.age,
        sex: feedbackData.submitter.sex,
      });
    }

    // Check for duplicate feedback using the unique identifier
    const serviceFeedbackIdentifier = JSON.stringify({
      submitterId: submitter.id,
      serviceId: feedbackData.serviceFeedback.serviceId || null,
      serviceKindId: feedbackData.serviceFeedback.serviceKindId,
      officeId: feedbackData.serviceFeedback.officeId,
      overallComment: feedbackData.serviceFeedback.overallComment,
      consent: feedbackData.formResponse.consent,
    });

    const existingFeedback = await prisma.serviceFeedback.findFirst({
      where: {
        submitterId: submitter.id,
        uniqueIdentifier: serviceFeedbackIdentifier,
      },
    });

    if (existingFeedback) {
      return {
        message: "Duplicate feedback. Cannot submit again.",
      };
    }

    // Fetch officeName from the database based on officeId
    const serviceRelated = await prisma.services.findUnique({
      where: {
        id: feedbackData.serviceFeedback.serviceId,
      },
      select: {
        title: true,
      },
    });

    // Fetch serviceKindDescription from the database based on serviceKindId
    const serviceKindDescription = await prisma.serviceKind.findUnique({
      where: {
        id: feedbackData.serviceFeedback.serviceKindId,
      },
      select: {
        description: true,
      },
    });

    // Fetch officeName from the database based on officeId
    const officeRelated = await prisma.offices.findUnique({
      where: {
        id: feedbackData.serviceFeedback.officeId,
      },
      select: {
        title: true,
      },
    });

    // Calculate average rating from the provided ratings
    const averageRating =
      feedbackData.data.reduce(
        (total, question) => total + question.rating,
        0
      ) / feedbackData.data.length;

    // Create serviceFeedback using the existing or new submitter
    const serviceFeedback = await prisma.serviceFeedback.create({
      data: {
        submitter: {
          connect: {
            id: submitter.id,
          },
        },
        serviceKind: {
          connect: {
            id: feedbackData.serviceFeedback.serviceKindId,
          },
        },
        officeVisited: {
          connect: {
            id: feedbackData.serviceFeedback.officeId,
          },
        },
        service: {
          connect: {
            id: feedbackData.serviceFeedback.serviceId,
          },
        },
        submittername: submitter.name,
        age: submitter.age,
        overallComment: feedbackData.serviceFeedback.overallComment,
        uniqueIdentifier: uuidv4(),
        averageRating: averageRating,
        responsiveness: 0,
        reliability: 0,
        accessAndFacilities: 0,
        communication: 0,
        integrity: 0,
        assurance: 0,
        outcome: 0,
        consent: feedbackData.formResponse.consent,
        serviceDesc: serviceRelated.title,
        officeName: officeRelated.title,
        serviceKindDescription: serviceKindDescription.description, // Include serviceKindDescription
        otherService: feedbackData.serviceFeedback.otherService,
      },
    });

    const createdDate = serviceFeedback.created_at.toLocaleDateString();

    // Update serviceFeedback fields based on categoryId
    feedbackData.data.forEach((question) => {
      const categoryId = question.categoryId;
      const rating = question.rating;

      const categoryField = getCategoryField(categoryId);
      if (categoryField) {
        serviceFeedback[categoryField] = rating;
      } else {
        console.error(`Invalid categoryId: ${categoryId}`);
      }
    });

    // Update serviceFeedback in the database
    await prisma.serviceFeedback.update({
      where: {
        id: serviceFeedback.id,
      },
      data: serviceFeedback,
    });

    // Create feedback questions
    const feedbackQuestions = feedbackData.data.map(async (question) => {
      return prisma.feedbackQuestion.create({
        data: {
          ...question,
          serviceFeedbackId: serviceFeedback.id,
        },
      });
    });

    await Promise.all(feedbackQuestions);

    const formattedResult = {
      formResponse: {
        consent: feedbackData.formResponse.consent,
      },
      submitter: {
        name: feedbackData.submitter.name,
        email: feedbackData.submitter.email,
        age: feedbackData.submitter.age,
        sex: feedbackData.submitter.sex,
      },
      serviceFeedback: {
        serviceKindId: feedbackData.serviceFeedback.serviceKindId,
        serviceKindDescription: serviceKindDescription.description, // Include serviceKindDescription
        otherService: feedbackData.otherService,
        officeId: feedbackData.serviceFeedback.officeId,
        officeName: officeRelated.title,
        serviceId: feedbackData.serviceFeedback.serviceId,
        serviceDesc: serviceRelated.title,
        overallComment: feedbackData.serviceFeedback.overallComment,
      },
      data: feedbackData.data,
      created_at: createdDate,
    };

    return formattedResult;
  } catch (error) {
    console.error("Error in submitFeedback:", error);
    throw new Error("Error in Process");
  }
}
// Helper function to get the category field based on categoryId
function getCategoryField(categoryId) {
  const categoryFieldMap = {
    2: "responsiveness",
    3: "reliability",
    4: "accessAndFacilities",
    5: "communication",
    7: "integrity",
    8: "assurance",
    9: "outcome",
    // Add more cases as needed for other categoryIds
  };
  return categoryFieldMap[categoryId];
}

//add category
async function addCategory(data) {
  try {
    const existingCategory = await prisma.categories.findFirst({
      where: {
        title: data.title,
      },
    });

    if (existingCategory) {
      return {
        message: "Duplicate Category. Please choose a different one",
      };
    }
    const newCategory = await feedbackDao.createCategory(data);
    const formattedResult = formatDateStrings(newCategory);

    return formattedResult;
  } catch (error) {
    console.error("Error!", error);
    throw new Error("Error in Process");
  }
}

//add specific question
async function addQuestion(data) {
  try {
    const existingQuestion = await prisma.questions.findFirst({
      where: {
        description: data.description,
      },
    });

    if (existingQuestion) {
      return {
        message: "Duplicate Question. Please choose a different one",
      };
    }

    const newQuestion = await feedbackDao.createQuestion(data);
    const formattedResult = formatDateStrings(newQuestion);

    return formattedResult;
  } catch (error) {
    console.error("Error!", error);
    throw new Error("Error in Process");
  }
}

//add kind of service (external or internal)
async function addServiceKind(data) {
  try {
    const existingServiceKind = await prisma.serviceKind.findFirst({
      where: {
        description: data.description,
      },
    });

    if (existingServiceKind) {
      return {
        message: "Duplicate service kind. Please choose a different one",
      };
    }
    const newServiceKind = await feedbackDao.createServiceKind(data);
    const formattedResult = formatDateStrings(newServiceKind);

    return formattedResult;
  } catch (error) {
    console.error("Error!", error);
    throw new Error("Error in Process");
  }
}

//add specific type of service
async function addServiceType(data) {
  try {
    const newServiceType = await feedbackDao.createService(data);
    const formattedResult = formatDateStrings(newServiceType);

    return formattedResult;
  } catch (error) {
    console.error("Error!", error);
    throw new Error("Error in Process");
  }
}

async function addOffice(data) {
  try {
    const existingOffice = await prisma.offices.findFirst({
      where: {
        title: data.title,
      },
    });

    if (existingOffice) {
      return {
        message: "Duplicate office name. Please choose a different one",
      };
    }
    const newOffice = await feedbackDao.createOffice(data);
    const formattedResult = formatDateStrings(newOffice);

    return formattedResult;
  } catch (error) {
    console.error("Error!", error);
    throw new Error("Error in Process");
  }
}

async function updateOfficeName(id, data) {
  try {
    const updatedOffice = await feedbackDao.updateOffice(id, data);
    return updatedOffice;
  } catch (error) {
    console.error("Error!", error);
    throw new Error("Error in Process");
  }
}

async function deleteOffice(id) {
  try {
    const delOffice = await feedbackDao.deleteOffice(id);
    return {
      message: "Office Deleted Successfully",
      data: delOffice,
    };
  } catch (error) {
    console.error("Error!", error);
    throw new Error("Error in Process");
  }
}

async function dateRangeFilter(startDate, endDate) {
  try {
    const filteredData = await feedbackDao.dateRangeFiltered(
      startDate,
      endDate
    );

    return filteredData;
  } catch (error) {
    console.error("Error!", error);
    throw new Error("Error in Process");
  }
}

async function filteredServices(relatedOfficeId, serviceKindId) {
  try {
    const service = await feedbackDao.filterService(
      relatedOfficeId,
      serviceKindId
    );

    // If either relatedOfficeId or serviceKindId is null, add the desired response entry
    if (relatedOfficeId !== null || serviceKindId !== null) {
      const otherConcern = {
        id: 4,
        title: "Other Services",
        relatedOfficeId: null,
        serviceKindId: null,
        created_at: "2024-04-27 07:33:11.950Z",
        updated_at: "2024-04-27 07:33:11.950Z",
      };
      service.push(otherConcern);
    }

    return service;
  } catch (error) {
    console.error("Error!", error);
    throw new Error("Error in Process");
  }
}

module.exports = {
  filteredServices,
  fetchAllQuestions,
  fetchAllServices,
  fetchAllCategories,
  fetchAllFeedbacks,
  fetchAllOffices,
  fetchAllSubmitters,
  fetchAllServiceKinds,
  submitFeedback,
  addCategory,
  addQuestion,
  addServiceKind,
  addServiceType,
  addOffice,
  updateOfficeName,
  formatDateStrings,
  dateRangeFilter,
  deleteOffice,
};
