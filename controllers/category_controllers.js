const Category = require("../schemas/Category");

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate({
      path: "products",
      select: "name _id",
    });
    if (categories.length) {
      res.status(200).json({ categories });
    } else {
      res.status(200).json({ message: "No categories found in database !" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, products } = req.body;
    const existingCategories = await Category.findOne({ name });
    if (existingCategories) {
      res.status(201).json({ message: "This category already exists !" });
    } else {
      const category = await Category.create({ name, products });
      res.status(201).json({ message: "New category created:", category });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const getOneCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id).populate({
      path: "products",
      select: "name description price _id",
    });
    if (category) {
      res.status(200).json({ category });
    } else {
      res.status(404).json({ message: "The category doesn´t exist !" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    res.status(200).json({
      message: "The following product has ben successfully changed:",
      category,
    });
  } catch (error) {}
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const getCategory = await Category.findById(id);
    if (getCategory.products.length === 0) {
      const category = await Category.findByIdAndDelete(id);
      res.status(200).json({
        message: "The follwoing category has been deleted:",
        category,
      });
    } else {
      res.status(200).json({
        message:
          "The category you are trying to delete contains products and hence can´t be deleted !",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  getOneCategory,
  editCategory,
  deleteCategory,
};
