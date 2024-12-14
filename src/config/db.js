"use strict";

const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

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
      process.env.DB_DATABASE, // Local database name
      process.env.DB_USER, // Local username
      process.env.DB_PASSWORD, // Local password
      {
        host: process.env.DB_HOST, // Local host
        port: process.env.DB_PORT, // Local port
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
