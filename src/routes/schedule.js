const express = require("express"),
    scheduleRouter = express(),
    bodyParser = require("body-parser"),
    knex = require("../knexClient"),
    isLoggedIn = require("../middleware/isLoggedIn");

// bodyParser
scheduleRouter.use(bodyParser.urlencoded({ extended: false }));

// get day
scheduleRouter.get("/", async (req, res, next) => {
    try {
        const day = await knex("schedule");

        // see if the day exists - if it doesn't, return an error
        if(!day[0]["day"])
            return res.status(400).json({message: "An error occurred."});

        // day exists - return
        return res.status(200).json({day: day[0]});
    } catch(err) {
        next(err);
    }
});

// update day
scheduleRouter.post("/", isLoggedIn,async (req, res, next) => {
    try {
        // make sure user is an admin
        const user = req.jwt;
        if(user.permissions !== "admin")
            return res.status(401).json({message: "Unauthorized. Must be an admin."});

        // del all rows in table first
        await knex("schedule").del();

        // insert new schedule w/ req.body.day
        await knex("schedule")
            .insert({
                day: req.body.day,
                type: req.body.type
            });
        return res.status(200).json({message: "Success!"});
    } catch (err) {
        next(err);
    }
});

module.exports = scheduleRouter;
