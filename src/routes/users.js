const express = require("express"),
    usersRouter = express(),
    bodyParser = require("body-parser"),
    bcrypt = require("bcrypt"),
    jwt = require("jsonwebtoken"),
    knex = require("../knexClient"),
    isLoggedIn = require("../middleware/isLoggedIn");

// dotenv
require("dotenv").config();

// set up bodyParser
usersRouter.use(bodyParser.urlencoded({ extended: false }));

// get all users' information (return name, email, and permissions)
usersRouter.get("/", isLoggedIn, async (req, res, next) => {
    const user = req.jwt;

    // check if admin
    if(user.permissions !== "admin")
        return res.status(401).json({message: "Unauthorized. Must be an admin to retrieve users."});

    // if admin, continue with fetching users
    try {
        const users = await knex("users").select(["id", "name", "email", "permissions"]);
        return res.status(200).json({users: users});
    } catch (err) {
        next(err);
    }
});

// edit user
usersRouter.put("/:userId", isLoggedIn, async (req, res, next) => {
    const user = req.jwt;

    // check if admin
    if(user.permissions !== "admin")
        return res.status(401).json({message: "Unauthorized. Must be an admin to modify users."});

    // check for all body (email, name, permissions)
    if(req.body.name === undefined || req.body.email === undefined || req.body.permissions === undefined)
        return res.status(400).json({message: "Not enough body provided."});

    // if all body are present, make the change and return 200 (if no error)
    try {
        await knex("users")
            .where({id: req.params.userId})
            .update({
                name: req.body.name,
                email: req.body.email,
                permissions: req.body.permissions
            });
        return res.status(200).json({message: "Success!"});
    } catch(err) {
        return res.status(500).json({message: "Something went wrong."});
    }
});

module.exports = usersRouter;
