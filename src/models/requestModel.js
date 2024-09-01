import Request from "./Request.js";
import { v4 as uuidv4 } from "uuid";

export const createRequest = async (csvData) => {
  const newRequest = new Request({
    requestId: uuidv4(),
    csvData,
    status: "In Progress",
    processedData: [],
  });
  await newRequest.save();
  return newRequest._id;
};

export const getRequestStatus = async (requestId) => {
  const request = await Request.findById(requestId);
  return request ? request.status : null;
};

export const updateImageUrl = async (
  requestId,
  serialNumber,
  outputImageUrls 
) => {
  const request = await Request.findById(requestId);
  if (request) {
    const data = request.csvData.find(
      (item) => item["S. No."] === serialNumber
    );
    if (data) {
      const processedData = {
        serialNumber,
        productName: data["Product Name"],
        inputImageUrls: data["Input Image Urls"],
        outputImageUrls : outputImageUrls  ,
      };
      await Request.findByIdAndUpdate(requestId, {
        $push: { processedData },
      });
    }
  }
};

export const markReqestAsCompleted = async (requestId) => {
  await Request.findByIdAndUpdate(requestId, {
    $set: { status: "Completed" },
  });
};

export const getProcessedData = async (requestId) => {
  const request = await Request.findById(requestId);
  if (!request) return null;
  return {
    processedData: request.processedData,
    isProcessed: request.status === "Completed",
  };
};
