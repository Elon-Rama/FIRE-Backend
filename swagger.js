const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "FIRE-APP",
    description: "Version 1.0"
  },
  host: "fire-backend-hmll.onrender.com",  
  basePath: "/",
  schemes: ["https"],  
};

const outputFile = "./swagger-output.json";
const routes = ["./index.js"];

swaggerAutogen(outputFile, routes, doc);
