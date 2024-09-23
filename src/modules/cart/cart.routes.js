import express from "express";
import * as CC from "./cart.controller.js";
import { createValidator } from "express-joi-validation";
import * as CV from "./cart.validation.js";
import { auth } from "../../middlewares/auth.js";

const router = express.Router();
const validator = createValidator();

router.post("/add",auth(), validator.body(CV.addProductToCart), CC.addProductToCart);
router.delete("/removeProductFromCart/:_id", CC.removeProductFromCart);
router.patch("/updateQuantity", CC.updateProductQuantity);
router.get("/getCartTotals",auth(),CC.getCartTotals)


router.patch(
  "/updateQuantity",
  validator.body(CV.updateProductQuantity),
  CC.updateProductQuantity
);

router.get("/totals", CC.getCartTotals);

export default router
