import { Router } from 'express';
import * as messageServices from './Services/message.services.js';
import { errorHandlerMiddleware } from '../../Middleware/error-handler.middleware.js';
import { authenticationMiddleware } from '../../Middleware/authentication.middleware.js';



const messageController = Router();

messageController.post("/send",  errorHandlerMiddleware(messageServices.sendMessageServices));
messageController.get("/list",  errorHandlerMiddleware(messageServices.getMessagesServices));
messageController.get("/messages", authenticationMiddleware(), errorHandlerMiddleware(messageServices.getUserMessagesServices));

export default messageController;