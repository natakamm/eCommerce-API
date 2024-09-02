const express = require("express");
const {
  getAllCategories,
  createCategory,
} = require("../controllers/category_controllers");

const api = express.Router();

api.route("/").get(getAllCategories).post(createCategory);

module.exports = api;
