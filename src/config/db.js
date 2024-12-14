"use strict";

const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
// const setupAssociations = require("../models/setupAssociations");
// setupAssociations();

dotenv.config();

console.log(process.env.DATABASE_URL, "❌❌❌❌");

const isProduction = process.env.NODE_ENV === "production";

const sequelize = isProduction
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      protocol: "postgres",
      logging: false, // Disable logging
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Necessary for SSL connections in production
        },
      },
    })
  : new Sequelize(
      process.env.DATABASE, // Local database name
      process.env.USER, // Local username
      process.env.PASSWORD, // Local password
      {
        host: process.env.HOST, // Local host
        port: process.env.DBPORT, // Local port
        dialect: "postgres",
        logging: console.log, // Enable logging in development
      }
    );

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log(
      `Connection established successfully with ${
        isProduction ? "remote" : "local"
      } database.`
    );
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

module.exports = sequelize;
