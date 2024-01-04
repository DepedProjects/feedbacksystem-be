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
