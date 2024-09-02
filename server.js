const express = require("express");
const app = express();
require("dotenv").config();
require("colors");
const cors = require("cors");
const connectDB = require("./database/dbinit");
connectDB();

const category = require("./routes/category_routes");
const product = require("./routes/product_routes");
const user_routes = require("./routes/user_routes");
const order_routes = require("./routes/order_routes"); // Add order routes

const port = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to our eCommerce API!");
});

app.use("/api/categories", category);
app.use("/api/products", product);
app.use("/api/users", user_routes);
app.use("/api/orders", order_routes); // Use order routes

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`.bgGreen.black);
});
