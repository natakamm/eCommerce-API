const express = require("express");
const {
  createProduct,
  getAllProducts,
  deleteProduct,
  editProduct,
  getOneProduct,
  removeCategoryFromProduct,
  addCategoryToProduct,
} = require("../controllers/product_controllers");

const api = express.Router();

api.route("/").get(getAllProducts).post(createProduct);
api.route("/:id").get(getOneProduct).put(editProduct).delete(deleteProduct);
api
  .route("/:prod_id/remove-category/:cat_id")
  .delete(removeCategoryFromProduct);
api.route("/:prod_id/add-category/:cat_id").put(addCategoryToProduct);

module.exports = api;
