const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["с.", "гр.", "ман."] },
  name: { type: String, required: true },
  municipality: { type: String, required: true },
  region: { type: String, required: true },
});
module.exports = mongoose.model("City", schema, "cities");
