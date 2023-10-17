const express = require("express"),
    advertsRouter = express(),
    fileUpload = require("express-fileupload"),
    bodyParser = require("body-parser"),
    knex = require("../knexClient"),
    fs = require("fs"),
    path = require("path"),
    isLoggedIn = require("../middleware/isLoggedIn");

// set up bodyParser
advertsRouter.use(bodyParser.urlencoded({ extended: false }));

// set up parsing files
advertsRouter.use(fileUpload());

advertsRouter.get("/", async (req, res, next) => {
    // return list of adverts
    try {
        const adverts = await knex("adverts");
        return res.status(200).json({adverts: adverts});
    } catch(err) {
        next(err);
    }
});

advertsRouter.post("/", isLoggedIn, async (req, res, next) => {
    // check if admin (only admins can make adverts with images)

    // req.jwt stores the DECODED jwt
    const user = req.jwt;

    if(!user || !(user.permissions === "admin"))
        return res.status(401).json({message: "Unauthorized. Must be an admin."});
    try {
        // continue with file upload
        await req.files["advert"].mv(path.join(__dirname, "..", "public", "adverts", req.files["advert"].name));

        // add filepath to db
        await knex("adverts")
            .insert({
                file_path: "/adverts/" + req.files["advert"].name
            });

        return res.status(200).json({message: "Success!"});

    } catch(err) {
        return next(err);
    }
});

advertsRouter.delete("/:eventId", isLoggedIn, async (req, res, next) => {
    // check if admin (only admins can make adverts with images)
    // req.jwt stores the DECODED jwt
    const user = req.jwt;

    if(!user || !(user.permissions === "admin"))
        return res.status(401).json({message: "Unauthorized. Must be an admin."});

    try {
        // delete file in fs and db
        // get file from db
        let file = await knex("adverts").where({id: req.params.eventId});
        file = file[0];
        await fs.unlink(path.join(__dirname, "..", "public", file.file_path), err => {
            if(err)
                throw err;
        });

        // delete from db
        await knex("adverts")
            .where({id: req.params.eventId})
            .del();

        return res.status(200).json({message: "Success!"});

    } catch(err) {
        return next(err);
    }
});

module.exports = advertsRouter;
