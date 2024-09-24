// index.js
const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongodb = require("./Mongo/DB");
require("dotenv").config();

// Import routes
const loginRoutes = require("./Routes/route");
const userRoutes = require("./Routes/route");
const fireRoutes  = require("./Routes/route");

// Swagger setup
const swaggerDocument = require("./swagger-output.json");
const swaggerUi = require("swagger-ui-express");

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(
    session({
        secret: "your_secret_key",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Set to true if using HTTPS
    })
);

// Routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/email", loginRoutes);
app.use("/user", userRoutes);
app.use('/fire',fireRoutes);

// MongoDB Connection
mongoose
    .connect(mongodb.url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected!");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

// Default Route
app.get("/", (req, res) => {
    res.send("Welcome to FIRE!");
});

// Server Start
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server connected on port ${port}`);
});

module.exports = app;
