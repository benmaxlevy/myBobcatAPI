const express = require("express"),
    authRouter = express(),
    bodyParser = require("body-parser"),
    crypto = require("crypto"),
    jwt = require("jsonwebtoken"),
    knex = require("../knexClient");

// dotenv
require("dotenv").config();

// sha256 hasher
const sha256 = x => crypto.createHash("sha256").update(x, "utf8").digest("hex");

// set up bodyParser
authRouter.use(bodyParser.urlencoded({ extended: false }));

// register route
authRouter.post("/register", (req, res, next) => {
    // first, check if the email is in use
    knex("users")
        .where({ email: req.body.email })
        .then(rows => {
            // if rows isn't empty, the email is in use - return json
            if(rows.length > 0)
                // 409 - conflict - user with email already exists
                return res.status(409).json({message: "A user with the provided email already exists."})
        })
        .catch(err => next(err));
    // if no account exists, continue with making one
    const hashedPassword = sha256(req.body.password);

    let permission = "student";
    // if in dev mode, make new user an admin
    if(process.env.RUN_TYPE === "dev")
        permission = "admin";

    // insert new user
    knex("users")
        .insert({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            permissions: permission
        })
        .catch(err => next(err));

    // if successful, http 200 + message
    return res.status(200).json({message: "Successfully created user"});
});

// login route
// expects req.body.email and req.body.password (plaintext) to be provided
authRouter.post("/login", (req, res, next) => {
    // hash pass
    const hashedPassword = sha256(req.body.password);
    // find user
    knex("users")
        .where({
            email: req.body.email, password: hashedPassword
        })
        .then(users => {
            // checking the number of users meeting the criteria
            if(users.length === 0)
                // non-existant
                return res.status(400).json({message:"Incorrect credentials"});
            else if(users.length > 1)
                // too many users (fatal)
                return next("Too many users (fatal)");

            // if user exists, create and return JWT - expires in 7 hours
            jwt.sign({
                email: req.body.email,
                permissions: users[0].permissions,
                exp: Math.floor(Date.now() / 1000) + (420 * 60)
            }, process.env.JWT_SECRET, (err, token) => {
                if(err)
                    return next(err);
                else
                    return res.status(200).json({message: "Successfully logged in", jwt: token});
            });
        });
});

module.exports = authRouter;