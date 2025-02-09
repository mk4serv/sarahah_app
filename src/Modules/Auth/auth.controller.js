import { Router } from "express";
import * as authServices from "./Services/authentication.services.js";
import { validationMiddleware } from "../../Middleware/validation.middleware.js";
import { SignUpSchema } from "../../validators/auth.schema.js";

// ✅ Signup Route
const authController = Router();

// ✅ Signup Route
authController.post("/signup", validationMiddleware(SignUpSchema), authServices.SignUpservices);
authController.post("/login", authServices.LoginServices);
authController.get("/verify/:token", authServices.VerifyEmailServices);
authController.post("/refresh-token", authServices.RefreshTokenServices);
authController.post("/logout", authServices.LogoutServices);
authController.patch("/forget-password", authServices.ForgetPasswordServices);
authController.put("/reset-password", authServices.resetPasswordServices);

export default authController;