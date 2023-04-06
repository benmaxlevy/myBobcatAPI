// dotenv
require("dotenv").config();

// defining the knex client
const knex = require("knex")({
    client: "mysql2",
    connection: {
        host: process.env.DB_IP,
        port: process.env.DB_PORT,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
});

module.exports = knex;