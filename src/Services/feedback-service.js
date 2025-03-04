const feedbackDao = require("../Database/feedback-dao");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");

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

async function fetchAllAgeBrackets() {
  try {
    const fetchedBrackets = await feedbackDao.getAllAgeBrackets();
    return fetchedBrackets;
  } catch (error) {
    console.error("Error in Process:", error);
    throw new Error("Error in Process");
  }
}

async function fetchAllClientTypes() {
  try {
    const fetchedClientTypes = await feedbackDao.getAllClientTypes();
    return fetchedClientTypes;
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

function determineAgeBracket(specAge) {
  if (specAge <= 19) return "19 or lower";
  if (specAge >= 20 && specAge <= 34) return "20-34";
  if (specAge >= 35 && specAge <= 49) return "35-49";
  if (specAge >= 50 && specAge <= 64) return "50-64";
  return "65 or higher";
}

//submit feedback
async function submitFeedback(feedbackData) {
  try {
    // Determine ageBracket based on specAge
    const ageBracket = determineAgeBracket(feedbackData.submitter.specAge);
    console.log("Determined age bracket:", ageBracket);

    const submitterName = feedbackData.submitter.name || "anonymous";
    const submitterEmail = feedbackData.submitter.email || `anonymous`;

    // Check or create the submitter
    const submitter = await prisma.submitters.create({
      data: {
        name: submitterName || "anonymous",
        email: submitterEmail || `anonymous`,
        sex: feedbackData.submitter.sex || null,
        specAge: feedbackData.submitter.specAge
          ? parseInt(feedbackData.submitter.specAge)
          : null,
        ageBracket: ageBracket || null,
        clientTypeId: feedbackData.submitter.clientTypeId || null,
      },
    });

    // Check for duplicate feedback based on the identifier
    const serviceFeedbackIdentifier = JSON.stringify({
      submitterId: submitter.id,
      serviceId: feedbackData.serviceFeedback.serviceId || null,
      serviceKindId: feedbackData.serviceFeedback.serviceKindId,
      officeId: feedbackData.serviceFeedback.officeId,
      overallComment: feedbackData.serviceFeedback.overallComment,
      consent: feedbackData.formResponse.consent,
    });

    const existingFeedback = await prisma.serviceFeedback.findFirst({
      where: { uniqueIdentifier: serviceFeedbackIdentifier },
    });

    if (existingFeedback) {
      return {
        message: "Duplicate feedback. Cannot submit again.",
      };
    }

    // Fetch related data (services, office, clientType)
    const [serviceRelated, officeRelated, relatedClientType] =
      await Promise.all([
        prisma.services.findUnique({
          where: { id: feedbackData.serviceFeedback.serviceId },
          select: {
            title: true,
            serviceKind: { select: { description: true } },
          },
        }),
        prisma.offices.findUnique({
          where: { id: feedbackData.serviceFeedback.officeId },
          select: { title: true },
        }),
        prisma.clientType.findUnique({
          where: { id: feedbackData.submitter.clientTypeId },
          select: { type: true },
        }),
      ]);

    console.log("Fetched related data:", {
      serviceRelated,
      officeRelated,
      relatedClientType,
    });

    // Calculate the average rating
    const validRatings = feedbackData.data.filter(
      (question) => question.rating > 0
    );
    const formattedAverageRating = validRatings.length
      ? parseFloat(
          (
            validRatings.reduce(
              (total, question) => total + question.rating,
              0
            ) / validRatings.length
          ).toFixed(2)
        )
      : 0.0;

    // Create the serviceFeedback
    const serviceFeedback = await prisma.serviceFeedback.create({
      data: {
        submitter: { connect: { id: submitter.id } },
        officeVisited: {
          connect: { id: feedbackData.serviceFeedback.officeId },
        },
        service: { connect: { id: feedbackData.serviceFeedback.serviceId } },
        ClientType: { connect: { id: feedbackData.submitter.clientTypeId } },
        submittername: submitter.name || "anonymous",
        email: submitter.email,
        sex: submitter.sex,
        overallComment: feedbackData.serviceFeedback.overallComment,
        uniqueIdentifier: serviceFeedbackIdentifier,
        averageRating: formattedAverageRating,
        responsiveness: 0,
        reliability: 0,
        accessAndFacilities: 0,
        communication: 0,
        costs: 0,
        integrity: 0,
        assurance: 0,
        outcome: 0,
        consent: feedbackData.formResponse.consent,
        awareCC: feedbackData.citizencharter.awareCC,
        seeCC: feedbackData.citizencharter.seeCC,
        useCC: feedbackData.citizencharter.useCC,
        serviceDesc: serviceRelated?.title || null,
        officeName: officeRelated?.title || null,
        relatedClientType: relatedClientType?.type || null,
        specificAge: submitter.specAge,
        ageBracket: submitter.ageBracket,
        serviceKindDescription:
          serviceRelated?.serviceKind?.description || null,
        otherService: feedbackData.serviceFeedback.otherService,
        startTime: feedbackData.serviceFeedback.startTime
          ? dayjs(feedbackData.serviceFeedback.startTime).toISOString()
          : dayjs().toISOString(),
      },
    });

    console.log("Service feedback created:", serviceFeedback);

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

    // Map feedback questions to the database
    const feedbackQuestions = feedbackData.data.map((question) =>
      prisma.feedbackQuestion.create({
        data: { ...question, serviceFeedbackId: serviceFeedback.id },
      })
    );
    await Promise.all(feedbackQuestions);

    const formattedResult = {
      formResponse: { consent: feedbackData.formResponse.consent },
      submitter: {
        name: submitter.name,
        email: submitter.email,
        relatedClientType: relatedClientType?.type,
        specAge: feedbackData.submitter.specAge,
        ageBracket: feedbackData.ageBracket,
        sex: feedbackData.submitter.sex,
      },
      citizencharter: feedbackData.citizencharter,
      serviceFeedback: {
        id: serviceFeedback.id,
        serviceKindId: feedbackData.serviceFeedback.serviceKindId,
        serviceKindDescription: serviceRelated.serviceKind?.description,
        otherService: feedbackData.otherService,
        officeId: feedbackData.serviceFeedback.officeId,
        officeName: officeRelated?.title,
        serviceId: feedbackData.serviceFeedback.serviceId,
        serviceDesc: serviceRelated?.title,
        overallComment: feedbackData.serviceFeedback.overallComment,
        startTime: feedbackData.serviceFeedback.startTime,
      },
      data: feedbackData.data,
      averageRating: formattedAverageRating,
      created_at: createdDate,
    };

    console.log("Formatted result:", formattedResult);

    return formattedResult;
  } catch (error) {
    console.error("Error in submitFeedback:", error);
    throw new Error("Error in Process");
  }
}

// Helper function to get the category field based on categoryId
function getCategoryField(categoryId) {
  const categoryFieldMap = {
    1: "responsiveness",
    2: "reliability",
    3: "accessAndFacilities",
    4: "communication",
    5: "costs",
    6: "integrity",
    7: "assurance",
    8: "outcome",
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

async function addAgebracket(data) {
  try {
    const ageBracket = await feedbackDao.addAge(data);
    return ageBracket;
  } catch (error) {
    console.error("Error!", error);
    throw new Error("Error in Process");
  }
}

async function addClientType(data) {
  try {
    const client = await feedbackDao.addClientType(data);
    return client;
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

async function updateServiceData(id, data) {
  try {
    const updatedService = await feedbackDao.updateService(id, data);
    return {
      message: "Data Updated Successfully",
      Data: updatedService,
    };
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

async function deleteAService(id) {
  try {
    const delService = await feedbackDao.deleteService(id);
    return {
      message: "Service Deleted Successfully",
      data: delService,
    };
  } catch (error) {
    console.error("Error!", error);
    throw new Error("Error in Process");
  }
}

async function dateRangeFilter(startDate, endDate, officeId) {
  try {
    const filteredData = await feedbackDao.dateRangeFiltered(
      startDate,
      endDate,
      officeId
    );

    return filteredData;
  } catch (error) {
    console.error("Error!", error);
    throw new Error("Error in Process");
  }
}

async function filteredServices(relatedOfficeId, serviceKindId) {
  try {
    const service = await feedbackDao.filterService(relatedOfficeId);

    // If either relatedOfficeId or serviceKindId is null, add the desired response entry
    if (relatedOfficeId !== null) {
      const otherConcern = {
        id: 4,
        title: "Other Concerns",
        relatedOfficeId: null,
        serviceKindId: null,
        created_at: "2024-05-15",
        updated_at: "2024-05-15",
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
  fetchAllAgeBrackets,
  fetchAllClientTypes,
  fetchAllQuestions,
  fetchAllServices,
  fetchAllCategories,
  fetchAllFeedbacks,
  fetchAllOffices,
  fetchAllSubmitters,
  fetchAllServiceKinds,
  submitFeedback,
  addAgebracket,
  addCategory,
  addClientType,
  addQuestion,
  addServiceKind,
  addServiceType,
  addOffice,
  updateOfficeName,
  updateServiceData,
  formatDateStrings,
  dateRangeFilter,
  deleteOffice,
  deleteAService,
};
