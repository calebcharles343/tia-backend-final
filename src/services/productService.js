"use strict";

const { getUserPresignedUrls } = require("../models/A3Bucket.js");
const Product = require("../models/Product.js");

const getProductByIdService = async (id) => {
  const product = await Product.findOne({ where: { id } });
  if (!product) {
    console.error(`Product with ID ${id} not found`);
    return null;
  }

  const avatarId = `productAvatar-${id}`;

  console.log(avatarId, "❌❌❌❌");
  const { presignedUrls, err } = await getUserPresignedUrls(avatarId);

  if (err) {
    product.avatar = undefined;
  } else {
    product.avatar = presignedUrls[0]?.url || undefined;
  }

  return product;
};

const getAllProductsService = async () => {
  const products = await Product.findAll();
  const productPromises = products.map(async (product) => {
    const updatedProduct = await getProductByIdService(product.id);
    return updatedProduct;
  });

  // Wait for all products to be processed
  const updatedProducts = await Promise.all(productPromises);

  return updatedProducts;
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
  if (!product) {
    console.error(`Product with ID ${id} not found`);
    return null;
  }
  await product.destroy();
  return product;
};

module.exports = {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
};
