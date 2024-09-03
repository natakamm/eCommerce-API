const User = require("../schemas/User");
const Product = require("../schemas/Product");
const Order = require("../schemas/Order");

// Getting all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("products.productId");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ error: "Server Error" });
  }
};
//getting one order only
const getOnlyOneOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("user")
      .populate("products.productId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Creating an order
const createOrder = async (req, res) => {
  try {
    const { userId, products } = req.body;

    if (!products || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Order must contain at least one product." });
    }

    // Validate if the user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: `Requested  ${userId} does not exist.` });
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
      total += product.price * item.quantity;
    }

    // Create the order
    const newOrder = await Order.create({
      user: userId,
      products: products.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      total,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error); // Correct the error variable
    res.status(500).json({ error: "Server Error" }); // Send a response for server errors
  }
};

// Deleting an order (providing order id)
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

//put ProductToOrder by providing orderId
const addProductToOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { products } = req.body;

    // Debugging output
    console.log("orderId:", orderId);

    // Validate presence of all required fields
    if (!orderId || !products || !Array.isArray(products)) {
      return res.status(400).json({
        message:
          "Invalid request format. Ensure 'orderId' is provided and 'products' is an array.",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    for (const item of products) {
      const { productId, quantity } = item;
      console.log("quantity:", quantity);
      console.log("productId:", productId);

      if (!productId || quantity === undefined) {
        return res.status(400).json({
          message: "Each product must have a 'productId' and 'quantity'.",
        });
      }

      // Find the product by ID
      const product = await Product.findById(productId);
      if (!product) {
        return res
          .status(400)
          .json({ message: `Product with ID ${productId} does not exist.` });
      }

      // Check if the product is already in the order
      const existingProduct = order.products.find(
        (item) => item.productId.toString() === productId
      );
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        order.products.push({ productId, quantity });
      }

      // Recalculate the total
      order.total += product.price * quantity;

      await order.save();

      res.status(200).json(order);
    }
  } catch (error) {
    console.error("Error adding product to order:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

//remove Product from Order proving orderId
const removeProductFromOrder = async (req, res) => {
  try {
    const { orderId, productId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const productIndex = order.products.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Product not found in the order" });
    }

    order.products.splice(productIndex, 1);
    // Recalculate the total
    let total = 0;
    for (let item of order.products) {
      const product = await Product.findById(item.productId);
      if (product) {
        total += product.price * item.quantity;
      }
    }
    order.total = total;

    if (order.products.length === 0) {
      // Delete the order if it has no products
      await Order.findByIdAndDelete(orderId);
      return res
        .status(200)
        .json({ message: "Order deleted because it had no products left." });
    }

    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.error("Error removing product from order:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOnlyOneOrder,
  deleteOrder,
  addProductToOrder,
  removeProductFromOrder,
};
