const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "FIRE-APP",
    description: "Version 1.0"
  },
  host: "localhost:5000",  
  basePath: "/",
  schemes: ["http"],  
};

const outputFile = "./swagger-output.json";
const routes = ["./index.js"];

swaggerAutogen(outputFile, routes, doc);
