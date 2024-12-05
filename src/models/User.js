import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"; // Your Sequelize instance
import Order from "./Order.js";
import Product from "./Product.js";
import Review from "./Review.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(50),
      defaultValue: "user",
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at", // Map to custom column name
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
      field: "password_changed_at",
    },
    passwordResetToken: {
      type: DataTypes.STRING(255),
      field: "password_reset_token",
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      field: "password_reset_expires",
    },
  },
  {
    tableName: "users", // Specify table name if different from model name
    timestamps: false, // Disable default `createdAt` and `updatedAt` fields
  }
);

// Associations

// User -> Order
User.hasMany(Order, {
  foreignKey: "UserId",
  as: "userOrders", // Updated alias to avoid duplication
});

Order.belongsTo(User, {
  foreignKey: "UserId",
  as: "user",
});

// User -> Review
User.hasMany(Review, {
  foreignKey: "userId",
  as: "userReviews", // Ensure unique alias
});

Review.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export default User;
