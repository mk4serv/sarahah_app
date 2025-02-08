import express from 'express';
import dotenv from 'dotenv'; // Load environment variables
dotenv.config();
import authController from './Modules/Auth/auth.controller.js';
import userController from './Modules/Users/user.controller.js';
import { database_connect } from './DB/connection.js';

async function bootstrap() {
    try {
        // ✅ Destructure imported utilities
        const { createHandler, handleResponse, handleError } = await import('./Utils/router-handler.utils.js');

        // ✅ Initialize Express app
        const app = express();
        app.use(express.json());

        // ✅ Await Database Connection
        await database_connect();

        // ✅ Routes Prefix
        app.use("/auth", authController);
        app.use("/user", userController);
        app.get("/", (req, res) => res.send("Hello from the root route"));

        // ✅ Set default port and handle the listening process
        const port = process.env.PORT || 3000;

        const server = app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

        // ✅ Error Handling Middleware
        app.use((err, req, res, next) => {
            handleError(res, err);
        });

    } catch (err) {
        console.error("Error starting the server:", err);
    }
}

export default bootstrap;
