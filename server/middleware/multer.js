import multer from "multer";

// ✅ Required for ImageKit
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
});