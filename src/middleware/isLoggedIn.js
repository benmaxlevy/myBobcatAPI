const express = require("express"),
    app = express(),
    jwt = require("jsonwebtoken");

// dotenv
require("dotenv").config();

const isLoggedIn = (req, res, next) => {
    if(req.get("authorization")) {
        let authorization = req.get("authorization");

        // verify JWT
        jwt.verify(authorization, process.env.JWT_SECRET, (err, decoded) => {
            if(err)
                return res.status(403).json({message: "Failed to verify JWT."});
            else {
                // store decoded JWT in req.jwt and next()
                req.jwt = decoded;
                next();
            }
        });
    } else
        return res.status(403).json({error: "No credentials sent!"});
};

module.exports = isLoggedIn;