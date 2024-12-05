import Product from "../models/Product.js";

export const getAllProductsService = async () => {
  const Products = await Product.findAll();
  return Products;
};

export const getProductByIdService = async (id) => {
  const Product = await Product.findByPk(id);
  return Product;
};

export const createProductService = async (product_name, price, stock) => {
  const newProduct = await Product.create({ product_name, price, stock });
  return newProduct;
};

export const updateProductService = async (body) => {
  const Product = await Product.findByPk(id);
  if (!Product) return null;

  // Update the fields
  await Product.update(body);
  return Product;
};

export const deleteProductService = async (id) => {
  const Product = await Product.findByPk(id);
  if (!Product) return null;

  await Product.destroy();
  return Product;
};
