"use strict";

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

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
      type: DataTypes.ENUM("User", "Admin"),
      defaultValue: "User",
      allowNull: false,
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: "users",
    timestamps: true,
    indexes: [{ unique: true, fields: ["email"] }],
  }
);

module.exports = User;
