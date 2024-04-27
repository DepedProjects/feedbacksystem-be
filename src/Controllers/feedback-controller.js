const express = require("express");
const feedBackRouter = express.Router();
const feedBackService = require("../Services/feedback-service");

feedBackRouter.get("/filteredFeedbackbyDate", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const results = await feedBackService.dateRangeFilter(startDate, endDate);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

feedBackRouter.get("/filteredServices", async (req, res) => {
  try {
    const { relatedOfficeId, serviceKindId } = req.query;

    const office = parseInt(relatedOfficeId);
    const serviceKind = parseInt(serviceKindId);

    const results = await feedBackService.filteredServices(office, serviceKind);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

feedBackRouter.get("/questions", async (req, res) => {
  try {
    const questions = await feedBackService.fetchAllQuestions();
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

feedBackRouter.get("/services", async (req, res) => {
  try {
    const services = await feedBackService.fetchAllServices();
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

feedBackRouter.get("/categories", async (req, res) => {
  try {
    const categories = await feedBackService.fetchAllCategories();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

feedBackRouter.get("/feedbacks", async (req, res) => {
  try {
    const feedbacks = await feedBackService.fetchAllFeedbacks();
    res.json(feedbacks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

feedBackRouter.get("/offices", async (req, res) => {
  try {
    const offices = await feedBackService.fetchAllOffices();
    res.json(offices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

feedBackRouter.get("/submitters", async (req, res) => {
  try {
    const submitters = await feedBackService.fetchAllSubmitters();
    res.json(submitters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

feedBackRouter.get("/servicekinds", async (req, res) => {
  try {
    const serviceKinds = await feedBackService.fetchAllServiceKinds();
    res.json(serviceKinds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

feedBackRouter.get("/testing", (req, res) => {
  res.json({
    success: true,
    message: "working.... Volume mounted in the working container",
  });
});

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

feedBackRouter.put("/updateOffice/:id", async (req, res) => {
  try {
    const officeId = parseInt(req.params.id, 10);

    const updatedOfficeData = await feedBackService.updateOfficeName(
      officeId,
      req.body
    );
    res.json(updatedOfficeData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


feedBackRouter.put("/updateService/:id", async (req, res) => {
  try {
    const serviceId = parseInt(req.params.id, 10);

    const updatedServiceData = await feedBackService.updateServiceData(
      serviceId,
      req.body
    );
    res.json(updatedServiceData);
  } catch (error) {
    console.error(error);
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

feedBackRouter.delete("/deleteOffice/:id", async (req, res) => {
  try {
    const offId = parseInt(req.params.id, 10);

    const deletedOfficeData = await feedBackService.deleteOffice(offId);

    res.json({ deletedOfficeData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = feedBackRouter;
