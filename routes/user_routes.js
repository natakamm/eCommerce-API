const express = require("express");
const {
  getAllUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user_controllers");

const api = express.Router();

api.route("/").get(getAllUsers).post(createUser);
api.route("/:userId").get(getOneUser).put(updateUser).delete(deleteUser);

module.exports = api;
