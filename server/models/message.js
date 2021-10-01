const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  date: Number,
  message: String,
  sender: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
});
module.exports = schema;
