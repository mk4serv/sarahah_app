import {Router} from "express";
import * as profileServices from "./Services/profile.services.js";

// ✅ Get User Profile Route
const userController = Router();

// ✅ Get User Profile Route
userController.get("/profile", profileServices.profileData);

export default userController;