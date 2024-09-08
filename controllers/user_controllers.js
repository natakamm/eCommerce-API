const User = require("../schemas/User");

//get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users.length) {
      res.status(200).json({ message: "No User found in the DB" });
    } else {
      res.status(200).json({ users });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
//get one User

const getOneUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (user) {
      return res.status(200).json({ user });
    }
    res.status(404).json({ message: "I did not find that user :(" });
  } catch (er) {
    res.status(500).json(er);
  }
};

//create a user
const createUser = async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const user = await User.create({
      name,
      email,
      address,
    });
    res.status(201).json({ message: "User created successfully", user });
  } catch (er) {
    res.status(500).json(er);
  }
};

//edit a user

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, address } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        address,
      },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: "I dont know this user" });
    } else {
      res.status(200).json({ message: "User updated successfully", user });
    }
  } catch (er) {
    res.status(501).json(er);
  }
};

//delete a User

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).json({ message: "No user found to delete" });
    } else {
      res.status(200).json({ message: "User record deleted successfully" });
    }
  } catch (er) {
    res.status(501).json(er);
  }
};

module.exports = {
  getAllUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
};
