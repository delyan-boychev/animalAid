const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  city: { type: mongoose.SchemaTypes.ObjectId, ref: "City", required: true },
  address: {
    type: String,
    required: true,
  },
  imgFileName: { type: String, required: true },
  additionalImages: { type: [String], required: true },
  description: { type: String, required: true },
  active: { type: Boolean, default: true, required: true },
  moderationVerified: {
    type: Boolean,
    required: true,
  },
});
module.exports = schema;
