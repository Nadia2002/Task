import express from "express"
import * as PC from "./product.controller.js"
import * as PV from "./product.validation.js"
import { createValidator } from 'express-joi-validation';
import { multerLocal, validExtensions } from "../../services/multer.js";

const validator = createValidator();
const upload = multerLocal(validExtensions.image, "products")
const router= express.Router()

router.post("/addProduct",upload.single("image"),validator.body(PV.addValidation.body),PC.addProduct)
router.put("/updateProduct/:_id",validator.params(PV.updateParamsValidation),validator.body(PV.updateBodyValidation), PC.updateProduct)
router.delete("/deleteProduct/:_id",PC.deleteProduct)



export default router