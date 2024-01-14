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
    throw new Error ("Error retrieving submitters data");
  }
}

async function getAllServiceKinds() {
  try {
    const kind = await prisma.serviceKind.findMany();
    return kind;
  } catch (error) {
    console.error("Error retrieving service kind data!");
    throw new Error ("Error retrieving service kind data");
  }
}

async function createSubmitter(data) {
  try {
    const createdSubmitter = await prisma.submitters.create({
      data: {
        name: data.name,
        email: data.email,
        age: data.age,
        sex: data.sex
      }
    });
    return createdSubmitter;
  } catch (error) {
    console.error("Error creating user data! ", error);
    throw new Error("Error creating user data");
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



//OTHERS
async function getSubmittersByDate(startDate, endDate) {
  try {
    if (startDate) {
      startDate.setHours(0, 0, 0, 0);
      if (!endDate) {
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 99, 999);
      }
    }
    const submitters = await prisma.submitters.findMany({
      include: {
        serviceFeedbacks: {
          where: {
            created_at: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
    });

    return submitters;
  } catch (error) {
    console.error("Error searching table data:", error);
  }
}

async function countSubmittersByRating(questionId, rating, ratingCount) {
  try {
    const result = await prisma.feedbackQuestion.groupBy({
      by: ['rating'],
      _count: {
        rating: true,
      },
      where: {
        questionId: parseInt(questionId, 10),
        rating: rating ? parseInt(rating, 10) : undefined,
      },
      orderBy: {
        rating: 'asc',
      },
    });

    if (ratingCount) {
      return result.map((item) => ({
        questionId: parseInt(questionId, 10),
        rating: item.rating,
        ratingCount: item._count.rating,
        submitters: [],
      }));
    } else {
      console.log('Fetching submitters for:', questionId, rating);

      const submittersResult = await prisma.serviceFeedback.findMany({
        where: {
          feedbackQuestion: {
            questionId: parseInt(questionId, 10),
            rating: rating ? parseInt(rating, 10) : undefined,
          },
        },
        include: {
          submitter: true,
        },
      });

      console.log('Fetched submitters:', submittersResult);

      const mappedResult = result.map((item) => {
        const matchingSubmitters = submittersResult.filter(
          (submitter) => submitter.feedbackQuestion.rating === item.rating
        );

        const submittersDetails = matchingSubmitters.map((matchingSubmitter) => ({
          submitterId: matchingSubmitter.submitter.id,
          name: matchingSubmitter.submitter.name,
          email: matchingSubmitter.submitter.email,
          age: matchingSubmitter.submitter.age,
          sex: matchingSubmitter.submitter.sex,
        }));

        return {
          questionId: parseInt(questionId, 10),
          rating: item.rating,
          ratingCount: item._count.rating,
          submitters: ratingCount ? [] : submittersDetails,
        };
      });

      console.log('Mapped result:', mappedResult);

      return mappedResult;
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error counting submitters by rating');
  }
}


module.exports = {
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
  deleteAllRecords,
  getSubmittersByDate,
  countSubmittersByRating,
};
