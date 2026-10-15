import multer from "multer";
import path from "path";

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File validation filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === "image") {
    const allowedImageExtensions = [".jpeg", ".jpg", ".png", ".webp"];
    if (allowedImageExtensions.includes(ext) && file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Expo banner must be a JPEG, PNG, or WebP image."), false);
    }
    return;
  }

  const allowedExtensions = [".jpeg", ".jpg", ".png", ".webp", ".pdf", ".doc", ".docx"];
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpg, png, webp) and documents (pdf, doc, docx) are allowed!"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter
});

export default upload;
