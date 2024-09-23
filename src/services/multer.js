import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import { AppError } from "../utils/classError.js";
import path from "path";
import fs from "fs";


export const validExtensions = {
  image: ["image/png", "image/jpeg"],
};


export const multerLocal = (customValidation = ["image/png"], customPath = "uploads") => {
  const allPath = path.resolve(`uploads/${customPath}`);
  
  
  if (!fs.existsSync(allPath)) {
    fs.mkdirSync(allPath, { recursive: true });
  }

  
  const storage = diskStorage({
    destination: function (req, file, cb) {
      cb(null, allPath);
    },
    filename: function (req, file, cb) {
      
      cb(null, nanoid(5) + path.extname(file.originalname)); 
    },
  });

  
  const fileFilter = function (req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(new AppError("File not supported", 400), false); 
  };


  const upload = multer({ storage: storage, fileFilter });
  return upload;
};
