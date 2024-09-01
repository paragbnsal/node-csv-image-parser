import sharp from "sharp";
import path from "path";
import fs from "fs";
import axios from "axios";
import {
  updateImageUrl,
  markReqestAsCompleted,
} from "../models/requestModel.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handleWebhookData = async (data) => {
  console.log("Webhook data received:", data);
};

async function downloadImage(url) {
  const response = await axios({
    url,
    responseType: "arraybuffer",
  });
  return response.data;
}

async function compressImage(inputBuffer, outputFilePath) {
  await sharp(inputBuffer)
    .jpeg({ quality: 50 }) // Reduce quality by 50%
    .toFile(outputFilePath);
}

async function processImages(requestId, data) {
  const compressedImages = [];

  for (const item of data) {
    const imageUrls = item["Input Image Urls"].split(", ");
    const compressedImagePaths = [];

    for (const url of imageUrls) {
      try {
        const imageBuffer = await downloadImage(url);

        // Define the output file path
        const outputFilePath = path.join(
          __dirname,
          `../../output/compressed/${item["Product Name"]}`,
          `${Date.now()}.jpg`
        );

        fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
        await compressImage(imageBuffer, outputFilePath);

        compressedImagePaths.push(outputFilePath);
      } catch (error) {
        console.error(`Failed to process image ${url}:`, error);
      }
    }
    await updateImageUrl(
      requestId,
      item["S. No."],
      compressedImagePaths.join(",")
    );
  }
  await markReqestAsCompleted(requestId);
  return compressedImages;
}

export default {
  processImages,
  handleWebhookData,
};
