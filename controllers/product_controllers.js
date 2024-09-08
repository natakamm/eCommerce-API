const Product = require("../schemas/Product");
const Category = require("../schemas/Category");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
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
    //text fields are handled by req.body ( Contains text fields from the form-data request ) while files are handled by Multer in req.file
    const { name, description, price } = req.body;
    const imageURL = req.file ? req.file.path : null;
    // Check if categories were received and ensure they are in array format
    let categories = req.body["categories"];
    if (categories && !Array.isArray(categories)) {
      categories = [categories]; // Convert single category to array
    }

    console.log("Parsed categories:", categories); // Log to verify
    // `category` is an array. This array contains the names of categories you want to find in the Category collection.
    // Find all documents in the Category collection where the name field is equal to any of the names in the category array.
    const existingCategories = await Category.find({
      name: { $in: categories },
    });
    console.log("Found categories:", existingCategories);

    // If the lengths don't match, then it means that one or more categories aren't correct.
    if (existingCategories.length !== categories.length) {
      return res
        .status(400)
        .json({ message: "One or more categories do not exist." });
    }

    // Map over the existingCategories to extract their _id values.
    const categoryIds = existingCategories.map((cat) => cat._id);

    // Create the product with the correct ObjectIds for the categories.
    const product = await Product.create({
      name,
      description,
      price,
      category: categoryIds,
      image: imageURL,
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
    const product = await Product.findById(id).populate("category");
    if (!product) {
      return res.status(404).json({ message: "This product doesn´t exist" });
    }
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAllFromCategory = async (req, res) => {
  try {
    const { cat_id } = req.params;
    const products = await Product.find({ category: { $in: cat_id } }).exec();
    if (!products) {
      return res
        .status(200)
        .json({ message: "No products found in this category ." });
    } else {
      res.status(200).json({ products });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price } = req.body;
    const imageURL = req.file ? req.file.path : null;
    const updateFields = { name, description, category, price };
    if (imageURL) {
      updateFields.image = imageURL; // Only update the image if a new one is provided
    }

    // Find and update the product
    const product = await Product.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

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
    const { id, cat_id } = req.params;

    const product = await Product.findById(id);
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
      category.products.pull(id);
      await category.save();
    }

    res.status(200).json({
      message: `The category ${cat_id} has been successfully remove from product ${id} .`,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const addCategoryToProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { cat_id } = req.body;

    const product = await Product.findById(id);
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
      category.products.push(id);
      await category.save();
    }

    res.status(200).json({
      message: `Category ${cat_id} has been successfully added to product ${id}.`,
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
  getAllFromCategory,
};
