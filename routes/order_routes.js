const express = require("express");
const {
  getAllOrders,
  createOrder,
  deleteOrder,
} = require("../controllers/order_controllers");

const api = express.Router();

api.route("/").get(getAllOrders).post(createOrder);
api.route("/:orderId").delete(deleteOrder);

module.exports = api;
