import {Router} from "express";
import * as UserServices from "./Services/profile.services.js";
import { authenticationMiddleware, authorizationMiddleware } from "../../Middleware/authentication.middleware.js";
import { systemRoles } from "../../constants/constants.js";
import { errorHandlerMiddleware } from "../../Middleware/error-handler.middleware.js";

// ✅ Get User Profile Route
const userController = Router();
const { ADMIN, USER, SUPER_ADMIN } = systemRoles;

userController.use(authenticationMiddleware());

userController.get("/profile",authorizationMiddleware([USER]), errorHandlerMiddleware (UserServices.profileServices));
userController.patch("/update-password", errorHandlerMiddleware (UserServices.updatePasswordServices));
userController.put("/update-profile", errorHandlerMiddleware (UserServices.updateProfileServices));
userController.get("/list", authorizationMiddleware([ADMIN, USER, SUPER_ADMIN]), errorHandlerMiddleware (UserServices.profileServices));

export default userController;