import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"; // Path to your Sequelize instance
import Review from "./Review.js";

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    ratingsQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ratingsAverage: {
      type: DataTypes.FLOAT,
      defaultValue: 4.5,
    },
  },
  {
    tableName: "products", // Specify table name explicitly
    timestamps: false, // Disable createdAt and updatedAt fields
  }
);

Product.hasMany(Review, { foreignKey: "productId", as: "reviews" });
Review.belongsTo(Product, { foreignKey: "productId", as: "product" });

export default Product;
