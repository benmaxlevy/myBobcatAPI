const express = require("express"),
    eventsRouter = express(),
    bodyParser = require("body-parser"),
    knex = require("../knexClient"),
    isLoggedIn = require("../middleware/isLoggedIn");

// set up bodyParser
eventsRouter.use(bodyParser.urlencoded({ extended: false }));

// get events
eventsRouter.get("/", async (req, res, next) => {
    try {
        const events = await knex("events");
        return res.status(200).json({events: events});
    } catch(err) {
        next(err);
    }
    
});

// post events
eventsRouter.post("/", isLoggedIn, async (req, res, next) => {
    try {
        // req.jwt stores the DECODED jwt
        const user = req.jwt;
        
        // check if user is admin or leader
    } catch (err) {
        next(err);
    }
});

module.exports = eventsRouter;