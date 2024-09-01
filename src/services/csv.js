import fs from "fs";
import csvParser from "csv-parser";
import { parse } from "json2csv";
import { createRequest } from "../models/requestModel.js";
import imageProcessingService from "./imageProcessing.js";

const readCsv = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        // Delete the file after processing
        fs.unlink(filePath, (err) => {
          if (err) {
            return reject(new Error("Error deleting file after processing."));
          }
          resolve(results);
        });
      })
      .on("error", (error) => {
        fs.unlink(filePath, (err) => {
          if (err) {
            return reject(new Error("Error deleting file after processing."));
          }
          reject(new Error("Error parsing CSV file."));
        });
      });
  });
};

const validateCsv = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }

  const requiredFields = ["S. No.", "Product Name", "Input Image Urls"];

  return data.every((row) => {
    // Ensure row is an object and has all required fields with non-empty values
    return requiredFields.every(
      (field) => row[field] && row[field].trim() !== ""
    );
  });
};

export const processCsv = async (filePath) => {
  const csvData = await readCsv(filePath);
  const isValid = validateCsv(csvData);
  if (!isValid) {
    throw new Error("Invalid CSV format");
  }

  const requestId = await createRequest(csvData);
  imageProcessingService.processImages(requestId, csvData);
  return requestId;
};

export const convertToCsv = (jsonData) => {
  try {
    // Define the fields and their corresponding CSV headers
    const fields = [
      { label: "S. No.", value: "serialNumber" },
      { label: "Product Name", value: "productName" },
      { label: "Input Image Urls", value: "inputImageUrls" },
      { label: "Output Image Urls", value: "outputImageUrls" }, // Empty column for Output Image Urls
    ];

    // Convert JSON data to CSV
    const csv = parse(jsonData, {
      fields,
      quote: '"',
      delimiter: ",",
      eol: "\n",
    });

    return csv;
  } catch (err) {
    // Handle any errors that occur during conversion
    console.error("Error converting JSON to CSV:", err);
    return null;
  }
};
