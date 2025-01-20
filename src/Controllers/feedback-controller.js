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
      officeId = parseInt(officeId, 10);
    }

    const data = await feedBackService.dateRangeFilter(
      startDate,
      endDate,
      officeId
    );

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
          return "Not Applicable";
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

    const groupedData = transformedData.reduce((acc, row) => {
      acc[row.officeName] = acc[row.officeName] || [];
      acc[row.officeName].push(row);
      return acc;
    }, {});

    const filename = `CSM_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;

    const headers = [
      "id",
      "submitterId",
      "consent",
      "startTime",
      "created_at",
      "email",
      "submittername",
      "language",
      "specificAge",
      "ageBracket",
      "sex",
      "relatedClientType",
      "officeName",
      "serviceKindDescription",
      "serviceDesc",
      "otherService",
      "awareCC",
      "seeCC",
      "useCC",
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
    ];

    const headerMappings = {
      id: { name: "Id", width: 20 },
      submitterId: { name: "Submitter Id", width: 20 },
      consent: { name: "Consent", width: 20 },
      startTime: { name: "Start Time", width: 25 },
      created_at: { name: "Completion Time", width: 25 },
      email: { name: "Email", width: 30 },
      submittername: { name: "Submitter Name", width: 30 },
      language: { name: "Language", width: 30 },
      specificAge: { name: "Age", width: 15 },
      ageBracket: { name: "Age Bracket", width: 15 },
      sex: { sex: "Sex", width: 15 },
      relatedClientType: { name: "Related Client Type", width: 25 },
      officeName: { name: "Office Name", width: 25 },
      serviceKindDescription: { name: "Service Kind Description", width: 30 },
      serviceDesc: { name: "Service Description", width: 30 },
      otherService: { name: "Other Service", width: 20 },
      awareCC: { name: "Aware CC", width: 15 },
      seeCC: { name: "See CC", width: 15 },
      useCC: { name: "Use CC", width: 15 },
      responsiveness: { name: "Responsiveness", width: 25 },
      reliability: { name: "Reliability", width: 25 },
      accessAndFacilities: { name: "Access and Facilities", width: 30 },
      communication: { name: "Communication", width: 25 },
      costs: { name: "Costs", width: 20 },
      integrity: { name: "Integrity", width: 20 },
      assurance: { name: "Assurance", width: 20 },
      outcome: { name: "Outcome", width: 20 },
      averageRating: { name: "Average Rating", width: 20 },
      overallComment: { name: "Overall Comment", width: 30 },
    };

    const workbook = new ExcelJS.Workbook();
    const uniqueWorksheetNames = new Set();

    Object.entries(groupedData).forEach(([officeName, rows]) => {
      // Truncate and ensure unique worksheet name
      let worksheetName = officeName.slice(0, 31);
      let suffix = 1;

      while (uniqueWorksheetNames.has(worksheetName)) {
        worksheetName = `${officeName.slice(0, 25)} (${suffix})`;
        suffix++;
      }

      uniqueWorksheetNames.add(worksheetName);
      const worksheet = workbook.addWorksheet(worksheetName);

      // Add headers and set column widths
      headers.forEach((header, index) => {
        const mapping = headerMappings[header];
        if (mapping) {
          const { name, width } = mapping;
          worksheet.getColumn(index + 1).width = width || 20;
          worksheet.getCell(1, index + 1).value = name || header;
        } else {
          worksheet.getCell(1, index + 1).value = header; // Fallback
        }
      });

      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "02f3f7" },
        };
        cell.font = { bold: true };
      });

      // Add rows
      rows.forEach((row) => {
        const rowData = headers.map((header) => row[header] || "");
        const addedRow = worksheet.addRow(rowData);

        // Apply date and time format to the startTime column
        const startTimeIndex = headers.indexOf("startTime") + 1; // Find the column index
        if (startTimeIndex > 0) {
          addedRow.getCell(startTimeIndex).numFmt = "mm/dd/yyyy hh:mm:ss AM/PM";
        }

        const completionTimeIndex = headers.indexOf("created_at") + 1; // Find the column index
        if (completionTimeIndex > 0) {
          addedRow.getCell(completionTimeIndex).numFmt =
            "mm/dd/yyyy hh:mm:ss AM/PM";
        }
      });

      // Calculate the correct column letter (to support up to 26 columns, you can extend this for larger numbers of columns)
      const getColumnLetter = (index) => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (index < 26) {
          return letters[index];
        } else {
          const firstLetter = letters[Math.floor(index / 26) - 1];
          const secondLetter = letters[index % 26];
          return firstLetter + secondLetter;
        }
      };

      // After adding rows, apply auto filter across all columns
      const lastColumnLetter = getColumnLetter(headers.length - 1); // Get the last column letter based on the number of headers

      // Apply the filter on the header row for all columns
      worksheet.autoFilter = `${"A1"}:${lastColumnLetter}1`;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    res.set({
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    });
    res.send(buffer);
  } catch (error) {
    console.error("Error exporting Excel:", error);
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
