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
    //console.log("Found categories:", existingCategories);

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

const getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate({
      path: "category",
      select: "name _id",
    });
    if (!product) {
      return res.status(404).json({ message: "This product doesn´t exist" });
    }
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json(error);
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      { name, description, category, price },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "A product has been successfully updated:", product });
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findById(id);

    if (!deleted) {
      return res.status(404).json({
        message: "The product you are trying to delete doesn´t exist !",
      });
    }
    const product = await Product.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "The following product has been deleted:", product });
  } catch (error) {
    res.status(500).json(error);
  }
};

const removeCategoryFromProduct = async (req, res) => {
  try {
    const { prod_id, cat_id } = req.params;

    const product = await Product.findById(prod_id);
    if (!product) {
      return res.status(404).json({ message: "Product doesn´t exist !" });
    }

    if (product.category.length === 1) {
      return res.status(400).json({
        message:
          "Category can't be removed because a product needs at least one category!",
      });
    }

    // Remove category from the product's category array
    product.category.pull(cat_id);
    await product.save();

    // Remove the product from the category's products array
    const category = await Category.findById(cat_id);
    if (category) {
      category.products.pull(prod_id);
      await category.save();
    }

    res.status(200).json({
      message: `The category ${cat_id} has been successfully remove from product ${prod_id} .`,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const addCategoryToProduct = async (req, res) => {
  try {
    const { prod_id, cat_id } = req.params;
    const product = await Product.findById(prod_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found !" });
    }

    if (product.category.includes(cat_id)) {
      return res.status(400).json({
        message: "Category is already associated with this product!",
      });
    }

    product.category.push(cat_id);
    await product.save();

    const category = await Category.findById(cat_id);
    if (category) {
      category.products.push(prod_id);
      await category.save();
    }

    res.status(200).json({
      message: `Category ${cat_id} has been successfully added to product ${prod_id}.`,
      product,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  deleteProduct,
  editProduct,
  getOneProduct,
  removeCategoryFromProduct,
  addCategoryToProduct,
};
