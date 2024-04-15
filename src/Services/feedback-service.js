const feedbackDao = require("../Database/feedback-dao");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");

function formatDateStrings(feedback) {
  if (feedback.created_at) {
    const createdDate = new Date(feedback.created_at);
    feedback.created_at = createdDate.toLocaleDateString(); // Adjust the formatting as needed
  }

  if (feedback.updated_at) {
    const updatedDate = new Date(feedback.updated_at);
    feedback.updated_at = updatedDate.toLocaleDateString(); // Adjust the formatting as needed
  }
  return feedback;
}

//FETCH ALL DATA
async function fetchAllServices() {
  try {
    const fetchedServices = await feedbackDao.getAllServices();
    return fetchedServices;
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
      },
    });

    // Update serviceFeedback fields based on categoryId
    feedbackData.data.forEach((question) => {
      const categoryId = question.categoryId;
      const rating = question.rating;

      switch (categoryId) {
        case 1:
          serviceFeedback.responsiveness = rating;
          break;
        case 2:
          serviceFeedback.reliability = rating;
          break;
        case 3:
          serviceFeedback.accessAndFacilities = rating;
          break;
        case 4:
          serviceFeedback.communication = rating;
          break;
        case 5:
          serviceFeedback.integrity = rating;
          break;
        case 6:
          serviceFeedback.assurance = rating;
          break;
        case 7:
          serviceFeedback.outcome = rating;
          break;
        default:
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
        officeId: feedbackData.serviceFeedback.officeId,
        serviceId: feedbackData.serviceFeedback.serviceId,
        overallComment: feedbackData.serviceFeedback.overallComment,
      },
      data: feedbackData.data,
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
    6: "integrity",
    7: "assurance",
    8: "outcome",
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

async function dateRangeFilter(startDate, endDate) {
  try {
    const filteredData = await feedbackDao.getSubmittersByDate(
      startDate,
      endDate
    );

    return filteredData;
  } catch (error) {
    console.error("Error!", error);
    throw new Error("Error in Process");
  }
}

module.exports = {
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
  formatDateStrings,
  dateRangeFilter,
};
