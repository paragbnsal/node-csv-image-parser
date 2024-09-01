import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  status: { type: String, default: "In Progress" },
  csvData: [{ type: Object }],
  processedData: [
    {
      serialNumber: String,
      productName: String,
      inputImageUrls: String,
      outputImageUrls: String,
    },
  ],
});

const Request = mongoose.model("Request", requestSchema);

export default Request;
