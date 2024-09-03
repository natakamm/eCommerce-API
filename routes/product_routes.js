const express = require("express");
const {
  createProduct,
  getAllProducts,
  deleteProduct,
  editProduct,
  getOneProduct,
  removeCategoryFromProduct,
  addCategoryToProduct,
  getAllFromCategory,
} = require("../controllers/product_controllers");
const upload = require("../services/upload");

const api = express.Router();

//upload.single("image")This middleware is provided by Multer, and it handles file uploads.
//.single("image") specifies that you're expecting a single file upload with the key name image in the request body.
//Multer processes the incoming request, handles the file upload, and makes the file information available under req.file
//inside the createProduct we check if req.file exists and use its path the file´s URL for the image in the product
api.route("/").get(getAllProducts).post(upload.single("image"), createProduct);
api.route("/:id").get(getOneProduct).put(editProduct).delete(deleteProduct);
api
  .route("/:prod_id/remove-category/:cat_id")
  .delete(removeCategoryFromProduct);
api.route("/:prod_id/add-category/:cat_id").put(addCategoryToProduct);
api.route("/category/:cat_id").get(getAllFromCategory);

module.exports = api;
