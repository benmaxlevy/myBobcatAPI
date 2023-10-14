const express = require("express"),
    advertsRouter = express(),
    fileUpload = require("express-fileupload"),
    bodyParser = require("body-parser"),
    knex = require("../knexClient"),
    fs = require("fs"),
    isLoggedIn = require("../middleware/isLoggedIn");

// set up bodyParser
advertsRouter.use(bodyParser.urlencoded({ extended: false }));

// set up parsing files
advertsRouter.use(fileUpload());

advertsRouter.post("/", isLoggedIn, async (req, res) => {
    // check if admin (only admins can make adverts with images)

    // req.jwt stores the DECODED jwt
    const user = req.jwt;

    if(!user || !(user.permissions === "admin"))
        return res.status(401).json({message: "Unauthorized. Must be an admin."});
    try {
        // continue with file upload
        await req.files["advert"].mv("./public/adverts/" + req.files["advert"].name);

        // add filepath to db
        await knex("adverts")
            .insert({
                file_path: "/adverts/" + req.files["advert"].name
            });

        return res.status(200).json({message: "Success!"});

    } catch {
        return res.status(500).json({message: "Something went wrong."});
    }
});

advertsRouter.delete("/:eventId", isLoggedIn, async (req, res) => {
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

        await fs.unlink("./public" + file.file_path, err => {
            if(err)
                return res.status(500).json({message: "Something went wrong."});
        });

        // delete from db
        await knex("adverts")
            .where({id: req.params.eventId})
            .del();

        return res.status(200).json({message: "Success!"});

    } catch(e) {
        return res.status(500).json({message: "Something went wrong."});
    }
});

module.exports = advertsRouter;
