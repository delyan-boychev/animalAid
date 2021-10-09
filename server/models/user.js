const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: { first: String, last: String },
  email: String,
  phoneNumber: String,
  city: String,
  password: String,
  createdOn: Number,
  role: String,
  URN: String,
  address: String,
  verified: Boolean,
  moderationVerified: Boolean,
  lastForgotPassword: Number,
  lastRequestForgotPassword: Number,
});
module.exports = mongoose.model("User", schema);
