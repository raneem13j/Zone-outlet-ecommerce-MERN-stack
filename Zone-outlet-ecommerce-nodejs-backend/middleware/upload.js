import multer from "multer";
import fs from "fs";

const dir = "uploads";

if (!fs.existsSync(dir)) {  // CREATE DIRECTORY IF NOT FOUND
  fs.mkdirSync(dir, { recursive: true });
}
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });

export default upload;