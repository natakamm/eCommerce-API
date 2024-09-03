const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please Enter a valid Email",
    ],
  },
  address: {
    type: String,
    maxLength: [100, "Address limit is 100 characters"],
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
