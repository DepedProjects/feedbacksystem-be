const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//GET ALL
async function getAllQuestions() {
  try {
    const questions = await prisma.questions.findMany();
    return questions;
  } catch (error) {
    console.error("Error retrieving users data! ", error);
    throw new Error("Error retrieving users data");
  }
}

async function getAllServices() {
  try {
    const services = await prisma.services.findMany();
    return services;
  } catch (error) {
    console.error("Error retrieving services data! ", error);
    throw new Error("Error retrieving services data");
  }
}

async function getAllCategories() {
  try {
    const categories = await prisma.categories.findMany();
    return categories;
  } catch (error) {
    console.error("Error retrieving categories data! ", error);
    throw new Error("Error retrieving categories data");
  }
}

async function getAllFeedbacks() {
  try {
    const feedbacks = await prisma.serviceFeedback.findMany();
    return feedbacks;
  } catch (error) {
    console.error("Error retrieving feedbacks data! ", error);
    throw new Error("Error retrieving feedbacks data");
  }
  S;
}

async function getAllOffices() {
  try {
    const offices = await prisma.offices.findMany();
    return offices;
  } catch (error) {
    console.error("Error retrieving offices data! ", error);
    throw new Error("Error retrieving offices data");
  }
}

async function getAllSubmitters() {
  try {
    const submitters = await prisma.submitters.findMany();
    return submitters;
  } catch (error) {
    console.error("Error retrieving submitters data!");
    throw new Error("Error retrieving submitters data");
  }
}

async function getAllServiceKinds() {
  try {
    const kind = await prisma.serviceKind.findMany();
    return kind;
  } catch (error) {
    console.error("Error retrieving service kind data!");
    throw new Error("Error retrieving service kind data");
  }
}

async function createSubmitter(data) {
  try {
    const createdSubmitter = await prisma.submitters.create({
      data: {
        name: data.name,
        email: data.email,
        age: data.age,
        sex: data.sex,
      },
    });
    return createdSubmitter;
  } catch (error) {
    console.error("Error creating user data! ", error);
    throw new Error("Error creating user data");
  }
}

async function filterService(relatedOfficeId, serviceKindId) {
  try {
    // Convert query parameters to integers if they are not null
    const serviceKindIdInt = serviceKindId ? parseInt(serviceKindId) : null;
    const relatedOfficeIdInt = relatedOfficeId
      ? parseInt(relatedOfficeId)
      : null;

    const filteredService = await prisma.services.findMany({
      where: {
        // Only include filter conditions if they are not null
        ...(serviceKindIdInt !== null && { serviceKindId: serviceKindIdInt }),
        ...(relatedOfficeIdInt !== null && {
          relatedOfficeId: relatedOfficeIdInt,
        }),
      },
    });

    return filteredService;
  } catch (error) {
    console.error("Error retrieving service!");
    throw new Error("Error retrieving service");
  }
}

async function dateRangeFiltered(startDate, endDate) {
  try {
    let whereCondition = {}; // Initialize an empty object for the where condition

    // Check if startDate and endDate are provided
    if (startDate && endDate) {
      // If both startDate and endDate are provided, add date range condition
      whereCondition = {
        AND: [
          { created_at: { gte: new Date(startDate) } },
          { created_at: { lte: new Date(endDate) } }, // Include all entries for the endDate up until the end of the day
        ],
      };
    }

    // Fetch data using the where condition
    const data = await prisma.serviceFeedback.findMany({
      where: whereCondition, // Use the where condition
    });

    return data;
  } catch (error) {
    console.error("Error in dateRangeFiltered:", error);
    throw error;
  }
}

//CREATE
async function createServiceFeedback(data) {
  try {
    const serviceFeedback = await prisma.serviceFeedback.create({
      data: {
        ...data,
        overallComment: data.overallComment,
        overallRating: data.overallRating,
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
    console.error("Error creating service!", error);
    throw new Error("Error creating service");
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

//UPDATE
async function updateOffice(id, data) {
  try {
    const updatedLevel = await prisma.offices.update({
      where: {
        id: id,
      },
      data: data,
    });
    return updatedLevel;
  } catch (error) {
    console.error("Error updating Office", error);
    throw new Error(error);
  }
}

async function updateService(id, data) {
  try {
    const updatedService = await prisma.services.update({
      where: {
        id: id,
      },
      data: data,
    });
    return updatedService;
  } catch (error) {
    console.error("Error updating Office", error);
    throw new Error(error);
  }
}

//DELETE
async function deleteAllRecords() {
  try {
    // Replace 'YourModel' with the actual name of your Prisma model (e.g., 'User')
    const deletedRecords = await prisma.categories.deleteMany({});

    console.log(`Deleted ${deletedRecords.count} records from the table.`);
  } catch (error) {
    console.error("Error erasing table data:", error);
  }
}

async function deleteOffice(id) {
  try {
    const deletedOffice = await prisma.offices.delete({
      where: {
        id: id,
      },
    });

    return deletedOffice;
  } catch (error) {
    console.error("Error erasing table data:", error);
  }
}

module.exports = {
  dateRangeFiltered,
  filterService,
  getAllQuestions,
  getAllServices,
  getAllCategories,
  getAllFeedbacks,
  getAllFeedbacks,
  getAllOffices,
  getAllSubmitters,
  getAllServiceKinds,
  createFeedbackQuestion,
  createServiceFeedback,
  createSubmitter,
  createCategory,
  createQuestion,
  createServiceKind,
  createService,
  createOffice,
  updateOffice,
  updateService,
  deleteAllRecords,
  deleteOffice,
};
