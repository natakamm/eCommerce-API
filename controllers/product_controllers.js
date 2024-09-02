const Product = require("../schemas/Product");
const Category = require("../schemas/Category");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate({
      path: "category",
      select: "name _id",
    });
    if (products.length) {
      res.status(200).json({ products });
    } else {
      res
        .status(200)
        .json({ message: "There are no products in the database !" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // `category` is an array. This array contains the names of categories you want to find in the Category collection.
    // Find all documents in the Category collection where the name field is equal to any of the names in the category array.
    const existingCategories = await Category.find({ name: { $in: category } });

    // If the lengths don't match, then it means that one or more categories aren't correct.
    if (existingCategories.length !== category.length) {
      return res
        .status(400)
        .json({ message: "One or more categories do not exist." });
    }
    console.log("Found categories:", existingCategories);

    // Map over the existingCategories to extract their _id values.
    const categoryIds = existingCategories.map((cat) => cat._id);

    // Create the product with the correct ObjectIds for the categories.
    const product = await Product.create({
      name,
      description,
      price,
      category: categoryIds,
    });

    for (let cat of existingCategories) {
      cat.products.push(product._id);
      await cat.save();
    }

    res.status(201).json({ message: "New product created:", product });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
    console.error("Error:", error);
  }
};

module.exports = {
  getAllProducts,
  createProduct,
};
