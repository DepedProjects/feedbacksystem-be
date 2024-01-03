const feedbackDao = require("../Database/feedback-dao");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  log: ["query", "info", "warn"],
});

function formatDateStrings(feedback) {
  if (feedback.created_at) {
    const createdDate = new Date(feedback.created_at);
    feedback.created_at = createdDate.toLocaleString(); // Adjust the formatting as needed
  }

  if (feedback.updated_at) {
    const updatedDate = new Date(feedback.updated_at);
    feedback.updated_at = updatedDate.toLocaleString(); // Adjust the formatting as needed
  }
  return feedback;
}

//submit feedback
async function submitFeedback(feedbackData) {
  try {
    // console.log("feedbackData:", feedbackData);

    const submitterData = {
      name: feedbackData.submitter.name,
      email: feedbackData.submitter.email,
      age: feedbackData.submitter.age,
      sex: feedbackData.submitter.sex,
    };

    const existingFeedback = await prisma.serviceFeedback.findFirst({
      where: {
        submitterId: feedbackData.submitter.id,
        serviceId: feedbackData.serviceFeedback.serviceId,
        serviceKindId: feedbackData.serviceFeedback.serviceKindId,
        officeId: feedbackData.serviceFeedback.officeId,
      },
    });

    if (existingFeedback) {
      return {
        message: "Duplicate feedback. Cannot submit again.",
      };
    }

    const submitter = await feedbackDao.createSubmitter(submitterData);
    const serviceFeedback = await feedbackDao.createServiceFeedback({
      ...feedbackData.serviceFeedback,
      submitterId: submitter.id,
      comment: feedbackData.serviceFeedback.comment,
    });

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
          serviceId: feedbackData.serviceFeedback.serviceId,
          serviceKindId: feedbackData.serviceFeedback.serviceKindId,
          officeVisited: feedbackData.serviceFeedback.officeId,
          form: feedbackData.data,
        },
      ],
      comment: serviceFeedback.comment || feedbackData.comment,
    });

    return formattedResult;
  } catch (error) {
    console.error("Error!", error);
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

async function deleteRecords(modelName) {
  try {
    const deletedRecords = await feedbackDao.deleteAllRecords(modelName);

    return deletedRecords;
  } catch (error) {
    console.error("Error!", error);
    throw new Error("Error in Process");
  }
}

module.exports = {
  submitFeedback,
  addCategory,
  addQuestion,
  addServiceKind,
  addServiceType,
  addOffice,
  formatDateStrings,
  deleteRecords,
};
