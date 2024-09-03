const User = require("../schemas/User");
const Product = require("../schemas/Product");
const Order = require("../schemas/Order");

// Getting all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "user",
        select: "name _id",
      })
      .populate({
        path: "products.productId", // Match this path with the Order schema field
        select: "name _id",
      });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Creating an order
const createOrder = async (req, res) => {
  try {
    const { userId, products } = req.body;

    // Validate if the user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "Requested UserId does not exist." });
    }

    let total = 0;

    // Validate if all products exist and calculate the total
    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          message: `Product with ID ${item.productId} does not exist.`,
        });
      }
      // total += product.price * item.quantity;
      total += product.price * 1;
    }

    // Create the order
    const newOrder = new Order({
      user: userId,
      products: products.map((item) => ({
        productId: item.productId,
        quantity: 1,
      })),
      total,
    });

    // Save the order as a document in MongoDB
    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error); // Correct the error variable
    res.status(500).json({ error: "Server Error" }); // Send a response for server errors
  }
};

//deleting an order:-
// Deleting an order
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await Order.findByIdAndDelete(orderId);

    if (!result) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  deleteOrder,
};
