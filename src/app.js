// imports
const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    path = require("path");

// dotenv
require("dotenv").config();

// route imports
const auth = require("./routes/auth"),
    events = require("./routes/events"),
    schedule = require("./routes/schedule"),
    individual_schedule = require("./routes/individual_schedule"),
    adverts = require("./routes/adverts"),
    users = require("./routes/users");

// middleware imports
const isLoggedIn = require("./middleware/isLoggedIn");

// using routes
app.use(auth);
app.use("/events", events);
app.use("/schedule", schedule);
app.use("/individual_schedule", individual_schedule);
app.use("/adverts", adverts);
app.use("/users", users)

// serve static files (adverts)
app.use(express.static(path.join(__dirname, "public")));

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
