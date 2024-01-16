import merge from "lodash.merge";
import dotenv from "dotenv";
dotenv.config();

const stage: string = process.env.NODE_ENV || 'development';
let config: any;

if (stage === "production") {
    config = require("./prod").default;
} else if (stage === "development") {
    config = require("./dev").default;
} else {
    throw new Error("Invalid NODE_ENV");
}

export default merge({ stage }, config);
