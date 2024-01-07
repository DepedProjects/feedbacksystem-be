const express = require("express");
const feedBackRouter = express.Router();
const feedBackService = require("../Services/feedback-service");



  // feedBackRouter.get("/testing", (req, res) => {
  //   res.json ({
  //     success: true,
  //     message: "working...."
  //   })
  // })

  feedBackRouter.post("/submitFeedback", async (req, res) => {
    try {
      const feedbackData = req.body;

      const createdFeedback = await feedBackService.submitFeedback(feedbackData);

      res.status(201).json(createdFeedback);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

feedBackRouter.post("/createCategory", async (req, res) => {
  try {
    const data = req.body;

    const createdCategory = await feedBackService.addCategory(data);

    res.status(201).json(createdCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

feedBackRouter.post("/createQuestion", async (req, res) => {
  try {
    const data = req.body;

    const createdQuestion = await feedBackService.addQuestion(data);

    res.status(201).json(createdQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

feedBackRouter.post("/createServiceKind", async (req, res) => {
  try {
    const data = req.body;

    const createdServiceKind = await feedBackService.addServiceKind(data);

    res.status(201).json(createdServiceKind);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

feedBackRouter.post("/createService", async (req, res) => {
  try {
    const data = req.body;

    const createdServiceType = await feedBackService.addServiceType(data);

    res.status(201).json(createdServiceType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

feedBackRouter.post("/createOffice", async (req, res) => {
  try {
    const data = req.body;

    const createdOffice = await feedBackService.addOffice(data);

    res.status(201).json(createdOffice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

feedBackRouter.delete("/deleteAllRecords", async (req, res) => {
  try {
    const modelName = req.params.model;

    const deletedModelRecords = await feedBackService.deleteRecords();

    res.status(201).json({
      message: `Successfully deleted records from ${modelName} table`,
      deletedModelRecords,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

feedBackRouter.get("/submittersByDate", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let feedbackSubmitters;

    if (startDate) {
      feedbackSubmitters = await feedBackService.dateRangeFilter(
        new Date(startDate),
        endDate && new Date(endDate)
      );
    } else {
      feedbackSubmitters = await feedBackService.dateRangeFilter();
    }

    res.json({ feedbackSubmitters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

feedBackRouter.get('/rating-count/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    const { rating, ratingCount } = req.query;

    const result = await feedBackService.countSubmittersByRating(questionId, rating, ratingCount);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = feedBackRouter;
