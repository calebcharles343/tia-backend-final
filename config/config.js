require("dotenv").config(); // Load environment variables from .env

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "88888888",
    database: process.env.DB_DATABASE || "shopping-list",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: true,
  },
  test: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "88888888",
    database: process.env.DB_DATABASE || "database_test",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: process.env.RENDER_USER || "admin",
    password: process.env.RENDER_PASSWORD_DB,
    database: process.env.RENDER_DATABASE,
    host: process.env.RENDER_DB_HOST, // Render database host
    port: 5432, // Standard PostgreSQL port
    dialect: "postgres",
    logging: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Render often requires this for SSL connections
      },
    },
  },
};
