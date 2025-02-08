import {Router} from "express";
import * as UserServices from "./Services/profile.services.js";
import { authenticationMiddleware } from "../../Middleware/authentication.middleware.js";

// ✅ Get User Profile Route
const userController = Router(); 

userController.get("/profile", authenticationMiddleware(), UserServices.profileServices);
userController.patch("/update-password", authenticationMiddleware(), UserServices.updatePasswordServices);

export default userController;