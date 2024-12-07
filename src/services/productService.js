"use strict";

const Product = require("../models/Product.js");

const getAllProductsService = async () => {
  const Products = await Product.findAll();
  return Products;
};

const getProductByIdService = async (id) => {
  const Product = await Product.findByPk(id);
  return Product;
};

const createProductService = async (
  name,
  description,
  category,
  price,
  stock
) => {
  const newProduct = await Product.create({
    name,
    description,
    category,
    price,
    stock,
  });
  return newProduct;
};

const updateProductService = async (body) => {
  await Product.update(body);
  return Product;
};

const deleteProductService = async (id) => {
  const Product = await Product.findByPk(id);
  if (!Product) return null;

  await Product.destroy();
  return Product;
};

module.exports = {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
};
