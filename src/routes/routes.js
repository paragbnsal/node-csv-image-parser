import { Router } from "express";
const router = Router();

import {
  uploadCsv,
  getStatus,
  handleWebhook,
  downloadCSV,
} from "../controllers/controller.js";

import multer from "multer";
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), uploadCsv);
router.get("/status/:requestId", getStatus);
router.get("/download/:requestId", downloadCSV);
router.post("webhook", handleWebhook);

export default router;
