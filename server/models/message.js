const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  date: Number,
  message: String,
  seen: Boolean,
  sender: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
});
module.exports = schema;
