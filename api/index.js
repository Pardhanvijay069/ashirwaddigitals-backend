require("dotenv").config();

console.log("1. index.js loaded");

try {
    const serverless = require("serverless-http");
    console.log("2. serverless-http loaded");

    const app = require("../src/app");
    console.log("3. app loaded");

    module.exports = serverless(app);
    console.log("4. export completed");
} catch (err) {
    console.error("BOOT ERROR:", err);
    throw err;
}