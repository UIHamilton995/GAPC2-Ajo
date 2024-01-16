"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const dev_1 = __importDefault(require("./config/dev"));
const app = (0, express_1.default)();
const port = 3000;
dotenv.config();
app.use(logger(dev_1.default));
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
config_1.db.sync({})
    .then(() => {
    console.log("Database is connected");
})
    .catch((err) => {
    console.log(err);
});
