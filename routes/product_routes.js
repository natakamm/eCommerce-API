const express = require("express");
const {
  createProduct,
  getAllProducts,
} = require("../controllers/product_controllers");

const api = express.Router();

api.route("/").get(getAllProducts).post(createProduct);

module.exports = api;
