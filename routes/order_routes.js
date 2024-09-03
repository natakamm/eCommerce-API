const express = require("express");
const {
  createOrder,
  getAllOrders,
  getOnlyOneOrder,
  deleteOrder,
  addProductToOrder,
  removeProductFromOrder,
} = require("../controllers/order_controllers");

const api = express.Router();

api.route("/").get(getAllOrders).post(createOrder); //get and create new orders(including product(s) and userids)
api.route("/:orderId").get(getOnlyOneOrder).delete(deleteOrder); //deleting specific order
api.route("/add-product/:orderId").put(addProductToOrder); //put new products using order id directly
api.route("/:orderId/remove-product/:productId").delete(removeProductFromOrder); //delete product(s) from order id

module.exports = api;
