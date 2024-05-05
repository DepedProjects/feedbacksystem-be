const express = require("express");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
const ExcelJS = require("exceljs");
const feedBackRouter = express.Router();
const feedBackService = require("../Services/feedback-service");

feedBackRouter.get("/filteredFeedbackbyDate", async (req, res) => {
  try {
    let { startDate, endDate, officeId } = req.query;

    // Parse officeId to integer if it exists
    if (officeId) {
      officeId = parseInt(officeId);
    }

    const results = await feedBackService.dateRangeFilter(
      startDate,
      endDate,
      officeId
    );
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

feedBackRouter.get("/filteredReport/exportExcel", async (req, res) => {
  try {
    let { startDate, endDate, officeId } = req.query;

    // Parse officeId to integer if it exists
    if (officeId) {
      officeId = parseInt(officeId);
    }

    const data = await feedBackService.dateRangeFilter(
      startDate,
      endDate,
      officeId
    );

    // Generate a dynamic filename based on the current timestamp
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(currentDate.getDate()).padStart(2, "0");
    filename = `CSM_Report_${year}${month}${day}.xlsx`;

    // Define the headers to be included in the Excel file
    const headers = [
      "consent",
      "submittername",
      "age",
      "serviceDesc",
      "otherService",
      "serviceKindDescription",
      "officeName",
      "responsiveness",
      "reliability",
      "accessAndFacilities",
      "communication",
      "integrity",
      "assurance",
      "outcome",
      "averageRating",
      "overallComment",
      "created_at",
    ];

    // Map headers to desired column names
    const headerMappings = {
      consent: { name: "Consent", width: 100 },
      submittername: { name: "Submitter", width: 200 },
      age: { name: "Age", width: 80 },
      serviceDesc: { name: "Service", width: 150 },
      otherService: { name: "Other Service", width: 150 },
      serviceKindDescription: { name: "Service Type", width: 150 },
      officeName: { name: "Office", width: 150 },
      responsiveness: { name: "Responsiveness", width: 120 },
      reliability: { name: "Reliability", width: 120 },
      accessAndFacilities: { name: "Access and Facilities", width: 180 },
      communication: { name: "Communication", width: 120 },
      integrity: { name: "Integrity", width: 100 },
      assurance: { name: "Assurance", width: 100 },
      outcome: { name: "Outcome", width: 100 },
      averageRating: {
        name: "Overall Satisfaction / Average Rating",
        width: 200,
      },
      overallComment: { name: "Comment / Suggestions", width: 200 },
      created_at: { name: "Submitted at", width: 180 },
    };

    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Customer Satisfaction Report");

    // Add headers to worksheet
    const headerRow = headers.map((header) => headerMappings[header].name);
    worksheet.addRow(headerRow);

    // Set header styles (width and color)
    const columns = worksheet.columns;
    columns.forEach((column, index) => {
      column.width = 50; // Set the width for each column (in characters)
      column.eachCell({ includeEmpty: true }, (cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "02f3f7" }, // Set the fill color (yellow)
        };
      });
    });

    // Add data rows
    data.forEach((row) => {
      row.created_at = dayjs(row.created_at).format("MM-DD-YYYY hh:mm A");
      const rowData = headers.map((header) => row[header]);
      worksheet.addRow(rowData);
    });

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();

    // Send the Excel file in the response with the correct MIME type and dynamic filename
    res.set({
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    });
    res.send(buffer);
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
