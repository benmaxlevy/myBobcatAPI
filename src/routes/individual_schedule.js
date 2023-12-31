const express = require("express"),
    individualScheduleRouter = express(),
    bodyParser = require("body-parser"),
    knex = require("../knexClient"),
    isLoggedIn = require("../middleware/isLoggedIn");

// set up bodyParser
individualScheduleRouter.use(bodyParser.urlencoded({ extended: false }));

// return all user's schedules
individualScheduleRouter.get("/", isLoggedIn, async (req, res, next) => {
try {
        const userId = req.jwt.id;
        const schedules = await knex("individual_schedules")
            .where({
                user_id: userId
            });

        return res.status(200).json({schedules: schedules});

    } catch (e) {
        next(e);
    }
});

// get a user's class given the period and day number
individualScheduleRouter.get("/day/:day/period/:period", isLoggedIn, async (req, res, next) => {
    try {
        const userId = req.jwt.id;
        console.log(req.params)
        // get individual_schedule where day_number=day & period=period
        let className = await knex("individual_schedules")
            .where({
                day_number: req.params.day,
                user_id: userId,
                period: req.params.period
            });
        className = className[0].class_name;

        return res.status(200).json({className: className});

    } catch (e) {
        next(e);
    }
});

// post (one day/period combination)
individualScheduleRouter.post("/", isLoggedIn, async (req, res, next) => {
    try {
        const userId = req.jwt.id;

        await knex("individual_schedules")
            .insert({
                period: req.body.period,
                day_number: req.body.day_number,
                class_name: req.body.class_name,
                user_id: userId
            });

        return res.status(200).json({message: "Success!"});

    } catch (e) {
        next(e);
    }
});

// put (one day/period combination)
individualScheduleRouter.put("/day/:day/period/:period", isLoggedIn, async (req, res, next) => {
    try {
        const userId = req.jwt.id;

        await knex("individual_schedules")
            .where({
                period: req.params.period,
                day_number: req.params.day,
                user_id: userId
            })
            .update({
                period: req.params.period,
                day_number: req.params.day,
                class_name: req.body.class_name
            });

        return res.status(200).json({message: "Success!"});

    } catch (e) {
        next(e);
    }
});

// delete

individualScheduleRouter.delete("/day/:day/period/:period", isLoggedIn, async (req, res, next) => {
    try {
        const userId = req.jwt.id;

        await knex("individual_schedules")
            .where({
                period: req.params.period,
                day_number: req.params.day,
                user_id: userId
            })
            .del();

        return res.status(200).json({message: "Success!"});

    } catch (e) {
        next(e);
    }
});

module.exports = individualScheduleRouter;