"use strict";

const catchAsync = require("../middleware/catchAsync.js");

const {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
} = require("../services/productService.js");

const handleResponse = require("../utils/handleResponse.js");

// Create a new product
const createProduct = catchAsync(async (req, res, next) => {
  const { name, description, category, price, stock } = req.body;
  const product = await createProductService(
    name,
    description,
    category,
    price,
    stock
  );

  handleResponse(res, 201, "Product created successfully", product);
});

// Get all products
const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await getAllProductsService();

  handleResponse(res, 200, "Products fetched successfully", products);
});

// Get a single product by ID
const getProductById = catchAsync(async (req, res, next) => {
  const product = await getProductByIdService(req.params.productId);
  if (!product) {
    handleResponse(res, 404, "Product not found");
  }

  handleResponse(res, 200, "Product fetched successfully", product);
});

// Update a product
const updateProduct = catchAsync(async (req, res, next) => {
  const product = await getProductByIdService(req.params.productId);
  if (!product) {
    handleResponse(res, 404, "Product not found");
  }
  const updatedProduct = await updateProductService(product, req.body);
  handleResponse(res, 200, "Product Updated successfully", updatedProduct);
});

// Delete a product
const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await getProductByIdService(req.params.productId);
  if (!product) {
    handleResponse(res, 404, "Product not found");
  }
  await deleteProductService(req.params.productId);

  handleResponse(res, 204, "Product deleted successfully");
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
