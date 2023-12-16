const express = require("express"),
    indiviudalScheduleRouter = express(),
    bodyParser = require("body-parser"),
    knex = require("../knexClient"),
    isLoggedIn = require("../middleware/isLoggedIn");

// set up bodyParser
indiviudalScheduleRouter.use(bodyParser.urlencoded({ extended: false }));

// get a user's class given the period and day number
indiviudalScheduleRouter.get("/day/:day/period/:period", isLoggedIn, async (req, res, next) => {
    try {
        const userId = req.jwt.id;

        // get individual_schedule where day_number=day & period=period
        let className = await knex("individual_schedules")
            .where({
                day_number: req.params.day,
                user_id: userId,
                period: req.params.period
            });
        className = className.class_name;

        return res.status(200).json({className: className});

    } catch (e) {
        next(e);
    }
});

// post
indiviudalScheduleRouter.post("/", isLoggedIn, async (req, res, next) => {
    try {
        const userId = req.jwt.id;

        await knex("individual_schedules")
            .insert({
                period: req.body.period,
                day_name: req.body.day_name,
                class_name: req.body.class_name,
                user_id: userId
            });

        return res.status(200).json({message: "Success!"});

    } catch (e) {
        next(e);
    }
});

module.exports = indiviudalScheduleRouter;