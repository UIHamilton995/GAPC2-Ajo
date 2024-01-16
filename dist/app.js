"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./config/logger")); // Assuming you have a logger configuration
const config_1 = require("./config");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000; // Use process.env.PORT if available, default to 3000
app.use(logger_1.default); // Assuming dev is already configured in the logger middleware
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
const startServer = async () => {
    try {
        await config_1.db.sync({});
        console.log('Database is connected');
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
    catch (err) {
        console.error('Error synchronizing the database:', err);
    }
};
startServer();
