import { globalErrorHandlerMiddleware } from '../Middleware/error-handler.middleware.js';
import * as controllers from '../Modules/index.js';

const controllerHandler = (app) => {

    // ✅ Routes Prefix
    app.use("/auth", controllers.authController);
    app.use("/user", controllers.userController);
    app.use("/message", controllers.messageController);

    app.get("/", (req, res) => res.send("Hello from the root route"));

    app.all("*", (req, res) => res.status(404).json({ message: "Route not found" }));

    app.use(globalErrorHandlerMiddleware)
}

export default controllerHandler;