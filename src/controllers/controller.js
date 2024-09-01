import { processCsv, convertToCsv } from "../services/csv.js";
import { getRequestStatus, getProcessedData } from "../models/requestModel.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const uploadCsv = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          200,
          null,
          "No file attached, Please attach a valid CSV file."
        )
      );
  }
  const requestId = await processCsv(req.file.path);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { requestId },
        "File uploaded successfully, processing started."
      )
    );
});

const getStatus = asyncHandler(async (req, res) => {
  const requestId = req.params.requestId;
  const status = await getRequestStatus(requestId);

  if (!status) {
    res.status(404).json(new ApiResponse(404, null, "Not Found"));
  }
  res.status(200).json(new ApiResponse(200, { status }));
});

const downloadCSV = asyncHandler(async (req, res) => {
  const requestId = req.params.requestId;
  const { processedData, isProcessed } = await getProcessedData(requestId);
  if (!processedData) {
    res
      .status(404)
      .json(new ApiResponse(404, null, "Processed Data Not Found"));
  }
  if (!isProcessed) {
    res.status(200).json(new ApiResponse(200, null, "Data is being Processed"));
  }
  // Convert processed data to CSV format
  const csvData = convertToCsv(processedData);
  res.header("Content-Type", "text/csv").status(200).send(csvData);
});

const handleWebhook = asyncHandler(async (req, res) => {
  await handleWebhook(req.body);
  res
    .status(200)
    .json({ message: "Webhook received and processed successfully." });
});

export { uploadCsv, getStatus, handleWebhook, downloadCSV };
