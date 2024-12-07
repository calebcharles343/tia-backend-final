"use strict";

const Product = require("../models/Product.js");

const getAllProductsService = async () => {
  const Products = await Product.findAll();
  return Products;
};

const getProductByIdService = async (id) => {
  const product = await Product.findOne({ where: { id } });

  return product;
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

const updateProductService = async (product, body) => {
  await product.update(body);
  return product;
};

const deleteProductService = async (id) => {
  const product = await Product.findOne({ where: { id } });
  if (!Product) return null;
  await product.destroy();
};

module.exports = {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
};
