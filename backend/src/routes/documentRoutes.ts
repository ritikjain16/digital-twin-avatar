import multer from "multer";
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { documentService, urlIngestSchema } from "../services/documentService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const upload = multer({ dest: "uploads/", limits: { fileSize: 20 * 1024 * 1024 } });
export const documentRoutes = Router();

documentRoutes.use(requireAuth);

documentRoutes.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json(await documentService.list(req.user!.id));
  })
);

documentRoutes.post(
  "/upload",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400).json({ message: "File is required" });
      return;
    }
    res.status(201).json(await documentService.ingestUpload(req.user!.id, req.file, req.body.kind));
  })
);

documentRoutes.post(
  "/url",
  asyncHandler(async (req, res) => {
    res.status(201).json(await documentService.ingestUrl(req.user!.id, urlIngestSchema.parse(req.body)));
  })
);
