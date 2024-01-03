const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
//   {
//   log: ["query", "info", "warn"],
// }

async function createSubmitter(data) {
  try {
    const createdSubmitter = await prisma.submitters.create({
      data,
    });

    return createdSubmitter;
  } catch (error) {
    console.error("Error creating user data! ", error);
    throw new Error("Error creating user data");
  }
}

async function createServiceFeedback(data) {
  try {
    console.log("Comment Value:", data.comment); // Add this line

    const serviceFeedback = await prisma.serviceFeedback.create({
      data: {
        ...data,
        comment: data.comment,
      },
    });

    return serviceFeedback;
  } catch (error) {
    console.error("Error creating service feedback!", error);
    throw new Error("Error creating service feedback");
  }
}

async function createFeedbackQuestion(data) {
  try {
    const feedbackQuestion = await prisma.feedbackQuestion.create({
      data,
    });

    return feedbackQuestion;
  } catch (error) {
    console.error("Error creating question!", error);
    throw new Error("Error creating question");
  }
}

async function createComment(data) {
  try {
    const comment = await prisma.create({
      data,
    });

    return comment;
  } catch (error) {
    console.error("Error creating comment!", error);
    throw new Error("Error creating comment");
  }
}

async function createCategory(data) {
  try {
    const category = await prisma.categories.create({
      data,
    });

    return category;
  } catch (error) {
    console.error("Error creating category!", error);
    throw new Error("Error creating category");
  }
}

async function createQuestion(data) {
  try {
    const question = await prisma.questions.create({
      data,
    });

    return question;
  } catch (error) {
    console.error("Error creating question!", error);
    throw new Error("Error creating question");
  }
}

async function createServiceKind(data) {
  try {
    const serviceKind = await prisma.serviceKind.create({
      data,
    });

    return serviceKind;
  } catch (error) {
    console.error("Error creating question!", error);
    throw new Error("Error creating question");
  }
}

async function createService(data) {
  try {
    const serviceType = await prisma.services.create({
      data,
    });

    return serviceType;
  } catch (error) {
    console.error("Error creating question!", error);
    throw new Error("Error creating question");
  }
}

async function createOffice(data) {
  try {
    const office = await prisma.offices.create({
      data,
    });

    return office;
  } catch (error) {
    console.error("Error creating question!", error);
    throw new Error("Error creating question");
  }
}

async function deleteAllRecords() {
  try {
    // Replace 'YourModel' with the actual name of your Prisma model (e.g., 'User')
    const deletedRecords = await prisma.categories.deleteMany({});

    console.log(`Deleted ${deletedRecords.count} records from the table.`);
  } catch (error) {
    console.error("Error erasing table data:", error);
  }
}

module.exports = {
  createFeedbackQuestion,
  createServiceFeedback,
  createSubmitter,
  createComment,
  createCategory,
  createQuestion,
  createServiceKind,
  createService,
  createOffice,
  deleteAllRecords,
};
