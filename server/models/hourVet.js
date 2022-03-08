const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  startHour: { type: Number, required: true },
  endHour: { type: Number, required: true },
});
module.exports = schema;
