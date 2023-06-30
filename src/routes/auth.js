const express = require("express"),
    authRouter = express(),
    bodyParser = require("body-parser"),
    bcrypt = require("bcrypt"),
    jwt = require("jsonwebtoken"),
    knex = require("../knexClient"),
    isLoggedIn = require("../middleware/isLoggedIn");

// dotenv
require("dotenv").config();

// set up bodyParser
authRouter.use(bodyParser.urlencoded({ extended: false }));

// register route
authRouter.post("/register", (req, res, next) => {
    // note to self: USE ASYNC/AWAIT
    let permission = "student";
    // if in dev mode, make new user an admin
    if(process.env.RUN_TYPE === "dev")
        permission = "admin";

    // check if all body are there

    if(req.body.name === undefined || req.body.email === undefined)
        return res.status(400).json({mesage: "Not enough body provided."});

    // first, check if the email is in use
    knex("users")
        .where({ email: req.body.email })
        .then(rows => {
            // if rows isn't empty, the email is in use - return json
            if(rows.length > 0)
                // 409 - conflict - user with email already exists
                return res.status(409).json({message: "A user with the provided email already exists."});
            else {
                let passwordSalt = "",
                    hashedPassword = "";
                // if no account exists, continue with making one
                bcrypt.genSalt(10, (err, salt) => {
                    if(err)
                        next(err);
                    // store user's salt
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if(err)
                            next(err);
                        // store hash
                        // insert new user
                        knex("users")
                            .insert({
                                name: req.body.name,
                                email: req.body.email,
                                password: hash,
                                salt: salt,
                                permissions: permission
                            })
                            .catch(err => next(err));
                        // if successful, http 200 + message
                        return res.status(200).json({message: "Successfully created user"});
                    });
                });
            }
         })
        .catch(err => next(err));
});

// login route
// expects req.body.email and req.body.password (plaintext) to be provided
authRouter.post("/login", async (req, res, next) => {
    try {
        // find user
        const user = await knex("users").where({
            email: req.body.email
        });
        if(user.length === 1) {
            // hash and salt to given password
            const hashedPassword = await bcrypt.hash(req.body.password, user[0].salt)
            // check pass
            if(hashedPassword === user[0].password)
                // return JWT - expires in 7 hours
                jwt.sign({
                    email: req.body.email,
                    permissions: user[0].permissions,
                    exp: Math.floor(Date.now() / 1000) + (420 * 60)
                }, process.env.JWT_SECRET, (err, token) => {
                    if(err)
                        next(err);
                    else
                        return res.status(200).json({message: "Successfully logged in", jwt: token});
                });
        } else {
            return res.status(401).json({message: "Incorrect credentials."});
        }
    } catch(err){
        next(err)
    }
});

module.exports = authRouter;