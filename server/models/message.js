const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  date: { type: Number, required: true },
  message: { type: String, required: true },
  seen: { type: Boolean, required: true },
  sender: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
});
module.exports = schema;
