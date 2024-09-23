import { Router } from "express";
import * as UC from "./user.controller.js"
const router = Router()
router.post("/signUp",UC.signUp)
router.get("/verifyEmail/:token",UC.verifyEmail)
router.get("/refreshToken/:rfToken",UC.refreshToken)
router.post("/signIn",UC.signIn)



export default router;