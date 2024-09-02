const express = require("express");
const {
  getAllCategories,
  createCategory,
  getOneCategory,
  editCategory,
  deleteCategory,
} = require("../controllers/category_controllers");

const api = express.Router();

api.route("/").get(getAllCategories).post(createCategory);
api.route("/:id").get(getOneCategory).put(editCategory).delete(deleteCategory);

module.exports = api;
