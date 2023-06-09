// imports
const express = require("express"),
    app = express(),
    bodyParser = require("body-parser");

// dotenv
require("dotenv").config();

// route imports
const auth = require("./routes/auth"),
    events = require("./routes/events");

// middleware imports
const isLoggedIn = require("./middleware/isLoggedIn");

// using routes
app.use(auth);
app.use("/events", events);

// 404
app.get("*", (req, res) => {
    res.status(404).json({message: "Not found"})
});

// error handler
app.use((err, req, res, next) => {
    console.error(err);
    if (res.headersSent) {
        return next(err);
    }
    return res.status(500).json({message: "Something went wrong."})
});

// start server
app.listen(process.env.RUN_PORT,
    _ => console.log(`We're up on ${process.env.RUN_PORT}!`));