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

    // Define a mapping function to transform numerical ratings to descriptions
    const mapRatingToDescription = (rating) => {
      switch (rating) {
        case 5:
          return "Strongly Agree (5)";
        case 4:
          return "Agree (4)";
        case 3:
          return "Neither Agree nor Disagree (3)";
        case 2:
          return "Disagree (2)";
        case 1:
          return "Strongly Disagree (1)";
        default:
          return "Not Applicable"; // Handle unexpected or missing values
      }
    };

    const transformedData = data.map((row) => ({
      ...row,
      responsiveness: mapRatingToDescription(row.responsiveness),
      reliability: mapRatingToDescription(row.reliability),
      accessAndFacilities: mapRatingToDescription(row.accessAndFacilities),
      communication: mapRatingToDescription(row.communication),
      costs: mapRatingToDescription(row.costs),
      integrity: mapRatingToDescription(row.integrity),
      assurance: mapRatingToDescription(row.assurance),
      outcome: mapRatingToDescription(row.outcome),
    }));

    // Generate a dynamic filename based on the current timestamp
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(currentDate.getDate()).padStart(2, "0");
    filename = `CSM_Report_${year}${month}${day}.xlsx`;

    // Define the headers to be included in the Excel file
    const headers = [
      "id",
      "consent",
      "startTime",
      "submittername",
      "relatedClientType",
      "ageBracket",
      "awareCC",
      "seeCC",
      "useCC",
      "serviceDesc",
      "otherService",
      "serviceKindDescription",
      "officeName",
      "responsiveness",
      "reliability",
      "accessAndFacilities",
      "communication",
      "costs",
      "integrity",
      "assurance",
      "outcome",
      "averageRating",
      "overallComment",
      "created_at",
    ];

    // Map headers to desired column names
    const headerMappings = {
      id: { name: "Id", width: 20 },
      consent: { name: "Consent", width: 20 },
      startTime: { name: "Start Time", width: 25 },
      submittername: { name: "Name", width: 30 },
      relatedClientType: { name: "Customer Type", width: 100 },
      awareCC: {
        name: "Are you aware of the Citizen's Charter - document of the SDO services and requirements?",
        width: 100,
      },
      seeCC: {
        name: "Did you see the SDO Citizen's Charter (online or posted in the office)?",
        width: 100,
      },
      useCC: {
        name: "Did you use the SDO Citizen's Charter as a guide for the service you availed?",
        width: 100,
      },
      ageBracket: { name: "Age Bracket", width: 20 },
      serviceDesc: { name: "Services Availed", width: 80 },
      otherService: { name: "Other Service", width: 80 },
      serviceKindDescription: { name: "Service Type", width: 20 },
      officeName: { name: "Office Transacted", width: 80 },
      responsiveness: {
        name: "Service Quality Dimension (SQD).SQD1 - I spent an acceptable amount of time to complete my transaction (Responsiveness)",
        width: 300,
      },
      reliability: {
        name: "Service Quality Dimension (SQD).SQD2 - The office accurately informed and followed the transaction's requirements and steps (Reliability)",
        width: 300,
      },
      accessAndFacilities: {
        name: "Service Quality Dimension (SQD).SQD3 - My transaction (including steps and payment) was simple and convenient (Access and Facilities)",
        width: 300,
      },
      communication: {
        name: "Service Quality Dimension (SQD).SDQ4 - I easily found information about my transaction from the office or its website (Communication)",
        width: 300,
      },
      costs: {
        name: "Service Quality Dimension (SQD).SQD5 - I paid an acceptable amount of fees for my transaction (Costs)",
        width: 300,
      },
      integrity: {
        name: "Service Quality Dimension (SQD).SQD6 - I am confident my transaction was secure (Integrity)",
        width: 300,
      },
      assurance: {
        name: "Service Quality Dimension (SQD).SQD7 - The office's support was quick to respond (Assurance)",
        width: 300,
      },
      outcome: {
        name: "Service Quality Dimension (SQD).SQD8 - I got what I needed from the government office (Outcome)",
        width: 300,
      },
      averageRating: {
        name: "Overall Satisfaction / Average Rating",
        width: 40,
      },
      overallComment: { name: "Comment / Suggestions", width: 80 },
      created_at: { name: "Completion time", width: 25 },
    };

    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Customer Satisfaction Report");

    // Add headers to worksheet and set column widths
    headers.forEach((header, index) => {
      const { name, width } = headerMappings[header];
      worksheet.getColumn(index + 1).width = width; // Set column width
      worksheet.getCell(1, index + 1).value = name; // Set header cell value
    });

    // Set header styles (fill color)
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "02f3f7" }, // Set the fill color (blue shade)
      };
      cell.font = { bold: true }; // Make the font bold
      cell.border = {
        top: { style: "thick" },
        bottom: { style: "thin" },
        right: { style: "thin" },
        left: { style: "thin" },
      };
    });

    // Add data rows and set horizontal alignment
    transformedData.forEach((row) => {
      row.created_at = dayjs(row.created_at).format("MM-DD-YYYY hh:mm A");
      row.startTime = row.startTime
        ? dayjs(row.startTime).format("MM-DD-YYYY hh:mm A")
        : null;
      row.averageRating = parseFloat(row.averageRating.toFixed(2));
      const rowData = headers.map((header) => row[header]);
      const dataRow = worksheet.addRow(rowData);
      dataRow.eachCell((cell) => {
        cell.alignment = { horizontal: "left" };
      });
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

feedBackRouter.get("/clientTypes", async (req, res) => {
  try {
    const clients = await feedBackService.fetchAllClientTypes();
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

feedBackRouter.get("/ageBrackets", async (req, res) => {
  try {
    const ages = await feedBackService.fetchAllAgeBrackets();
    res.json(ages);
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

feedBackRouter.post("/createAgebracket", async (req, res) => {
  try {
    const data = req.body;

    const createdAgeBracket = await feedBackService.addAgebracket(data);

    res.status(201).json(createdAgeBracket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

feedBackRouter.post("/createClientType", async (req, res) => {
  try {
    const data = req.body;

    const createdClient = await feedBackService.addClientType(data);

    res.status(201).json(createdClient);
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

    res.status(200).json({ feedbackSubmitters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

feedBackRouter.delete("/deleteOffice/:id", async (req, res) => {
  try {
    const offId = parseInt(req.params.id, 10);

    const deletedOfficeData = await feedBackService.deleteOffice(offId);

    res.status(200).json({ deletedOfficeData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

feedBackRouter.delete("/deleteService/:id", async (req, res) => {
  try {
    const servId = parseInt(req.params.id, 10);

    const deletedServiceData = await feedBackService.deleteAService(servId);

    res.status(200).json({ deletedServiceData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = feedBackRouter;
