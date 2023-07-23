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
        if(user.permissions === "student")
            return res.status(401).json({message: "Unauthorized. Must be an admin or student leader."});
        // check if all body are there
        if(req.body.name === undefined || req.body.date_time === undefined)
            return res.status(400).json({mesage: "Not enough body provided."});
        // if all conditions are satisfied, insert
        await knex("events")
            .insert({
                name: req.body.name,
                date_time: new Date(req.body.date_time),
                creator_id: user.id
            });
        return res.status(200).json({message: "Success!"});

    } catch (err) {
        next(err);
    }
});

// put events
eventsRouter.put("/:eventId", isLoggedIn, async (req, res, next) => {
    try {
        // req.jwt stores the DECODED jwt
        const user = req.jwt;

        // get event
        const event = await knex("events")
            .where({
                id: req.params.eventId
            });

        // check if user is admin or leader
        if(user.permissions === "student" || (user.permissions === "leader" && event[0].creator_id !== user.id))
            return res.status(401).json({message: "Unauthorized. Must be an admin or student leader who's created the event."});

        // check if all body are there
        if(req.body.name === undefined || req.body.date_time === undefined)
            return res.status(400).json({mesage: "Not enough body provided."});

        // if all conditions are satisfied, put
        await knex("events")
            .where({id: req.params.eventId})
            .update({
                name: req.body.name,
                date_time: new Date(req.body.date_time)
            });

        return res.status(200).json({message: "Success!"});

    } catch (err) {
        next(err);
    }
});

// delete events
eventsRouter.delete("/:eventId", isLoggedIn, async (req, res, next) => {
    try {
        // req.jwt stores the DECODED jwt
        const user = req.jwt;

        // get event
        const event = await knex("events")
            .where({
                id: req.params.eventId
            });

        // check if user is admin or leader
        if(user.permissions === "student" || (user.permissions === "leader" && event[0].creator_id !== user.id))
            return res.status(401).json({message: "Unauthorized. Must be an admin or student leader who's created the event."});

        // if all conditions are satisfied, put
        await knex("events")
            .where({id: req.params.eventId})
            .del();

        return res.status(200).json({message: "Success!"});

    } catch (err) {
        next(err);
    }
});

module.exports = eventsRouter;