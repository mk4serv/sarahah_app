import { Router } from "express";
import * as authServices from "./Services/authentication.services.js";

// ✅ Signup Route
const authController = Router();

// ✅ Signup Route
authController.post("/signup", authServices.SignUpservices);
authController.post("/login", authServices.LoginServices);
authController.get("/verify/:token", authServices.VerifyEmailServices);

export default authController;