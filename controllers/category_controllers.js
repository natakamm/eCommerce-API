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

//when use .create-> it cretaes and saves on its own
//when use new keyword with Schema name then , we need to save also

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

module.exports = {
  getAllCategories,
  createCategory,
};
