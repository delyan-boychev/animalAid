const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  municipality: { type: String, required: true },
});
module.exports = mongoose.model("Municipality", schema, "municipalities");
