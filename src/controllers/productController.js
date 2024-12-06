import Product from "../models/Product.js";
import { catchAsync } from "../utils/catchAsync.js";
import { handleResponse } from "../utils/handleResponse.js";

// Create a new product
export const createProduct = catchAsync(async (req, res, next) => {
  const { name, description, category, price, stock } = req.body;
  const product = await Product.create({
    name,
    description,
    category,
    price,
    stock,
  });

  handleResponse(res, 201, "Product created successfully", product);
});

// Get all products
export const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll();

  handleResponse(res, 200, "Products fetched successfully", products);
});

// Get a single product by ID
export const getProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    handleResponse(res, 404, "Product not found");
  }

  handleResponse(res, 200, "Product fetched successfully", product);
});

// Update a product
export const updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    handleResponse(res, 404, "Product not found");
  }
  await product.update(req.body);
  handleResponse(res, 200, "Product Updated successfully", product);
});

// Delete a product
export const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    handleResponse(res, 404, "Product not found");
  }
  await product.destroy();
  handleResponse(res, 204, "Product deletedted successfully");
});
