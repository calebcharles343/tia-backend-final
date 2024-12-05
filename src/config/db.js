import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Create a Sequelize instance with the connection string
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false, // Disable logging or replace with a custom logging function
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Necessary for SSL connections
    },
  },
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection established successfully with Sequelize.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

export default sequelize;
