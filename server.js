const express = require("express");
const app = express();
require("dotenv").config();
require("colors");
const cors = require("cors");
const connectDB = require("./database/dbinit");
connectDB();
//here to be imported routes like const products = require("./routes/product_routes")
const category = require("./routes/category_routes");
const product = require("./routes/product_routes");

const port = process.env.PORT || 8081;

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to our eCommerce API !");
});

//here middlewares like app.use("/api/products", product )
app.use("/api/categories", category);
app.use("/api/products", product);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`.bgGreen.black);
});
