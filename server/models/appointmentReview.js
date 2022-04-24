const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: () => {
      return new Date();
    },
  },
  review: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
});
module.exports = schema;
