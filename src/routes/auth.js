const express = require("express"),
    authRouter = express(),
    bodyParser = require("body-parser");

// set up bodyParser
bodyParser.use(bodyParser.urlencoded({ extended: false }));

// register route
authRouter.post("/register", (req, res) => {
    
});

module.exports = authRouter;