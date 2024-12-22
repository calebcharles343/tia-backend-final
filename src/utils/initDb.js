"use strict";

const sequelize = require("../config/db");
const models = require("../models");

async function initializeDatabase() {
  try {
    // Models are already initialized through models/index.js
    // Just sync the database
    await sequelize.sync({ alter: true });
    console.log("Database models synchronized successfully.");

    return models;
  } catch (error) {
    console.error("Unable to sync database:", error);
    process.exit(1);
  }
}

module.exports = initializeDatabase;
