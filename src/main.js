import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; // Load environment variables
dotenv.config();
import { database_connect } from './DB/connection.js';
import controllerHandler from './Utils/router-handler.utils.js';

async function bootstrap() {
    
    // ✅ Initialize Express app
    const app = express();
    
    // ✅ Set default port and handle the listening process
    const port = process.env.PORT;
    
    app.use(cors());
    app.use(express.json());

    // ✅ Load Controllers
    controllerHandler(app);

    // ✅ Await Database Connection
    await database_connect();

    const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });

}

export default bootstrap;
