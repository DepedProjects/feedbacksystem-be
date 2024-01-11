const feedbackDao = require("../Database/feedback-dao");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');
//   {
//    log: ["query", "info", "warn"],
// }

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

        const category =await prisma.categories.findUnique({
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
      submitterId: feedbackData.submitter.id,
      serviceDesc: feedbackData.serviceFeedback.serviceDesc || null,
      serviceKindId: feedbackData.serviceFeedback.serviceKindId,
      officeId: feedbackData.serviceFeedback.officeId,
      overallComment: feedbackData.serviceFeedback.overallComment,
      overallRating: feedbackData.serviceFeedback.overallRating,
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

    // Create serviceFeedback using the existing or new submitter
    const serviceFeedback = await feedbackDao.createServiceFeedback({
      ...feedbackData.serviceFeedback,
      submitterId: submitter.id,
      overallComment: feedbackData.serviceFeedback.overallComment,
      overallRating: feedbackData.serviceFeedback.overallRating,
      uniqueIdentifier: uuidv4(),
    });

    // Create feedback questions
    const feedbackQuestions = feedbackData.data.map(async (question) => {
      return feedbackDao.createFeedbackQuestion({
        ...question,
        serviceFeedbackId: serviceFeedback.id,
      });
    });

    await Promise.all(feedbackQuestions);

    const formattedResult = formatDateStrings({
      message: "Successfully Submitted your response! ",
      feedbackId: serviceFeedback.id,
      data: [
        {
          id: submitter.id,
          serviceDesc: feedbackData.serviceFeedback.serviceDesc,
          serviceKindId: feedbackData.serviceFeedback.serviceKindId,
          officeVisited: feedbackData.serviceFeedback.officeId,
          form: feedbackData.data,
        },
      ],
      overallComment:
        serviceFeedback.overallComment || feedbackData.overallComment,
      overallRating:
        serviceFeedback.overallRating || feedbackData.overallRating,
      created_at: serviceFeedback.created_at,
      updated_at: serviceFeedback.updated_at,
    });

    return formattedResult;
  } catch (error) {
    console.error("Error in submitFeedback:", error);
    throw new Error("Error in Process");
  }
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
    const existingServiceType = await prisma.services.findFirst({
      where: {
        title: data.title,
      },
    });

    if (existingServiceType) {
      return {
        message: "Duplicate service. Please choose a different one",
      };
    }
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
