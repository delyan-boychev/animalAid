const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  author: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  date: {
    type: Number,
    required: true,
    default: parseInt(new Date().getTime().toString()),
  },
});
module.exports = schema;
