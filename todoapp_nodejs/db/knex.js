const environment = "development";
const config = require("../knexfile.js")[environment];
const knex = require("knex")(config);
const bcrypt = require("bcrypt");

module.exports = knex;