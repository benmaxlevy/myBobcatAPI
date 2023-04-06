// imports
const express = require("express"),
    app = express(),
    bodyParser = require("body-parser");

// dotenv
require("dotenv").config()

// route imports
const auth = require("routes/auth");

// using routes
app.use(auth);

// 404
app.get("*", (req, res) => {
    res.status(404).json({"message": "404 — not found"})
});

// error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({"message": "Something went wrong."})
});