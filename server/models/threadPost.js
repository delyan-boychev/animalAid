const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const schema = new mongoose.Schema({
  author: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  replyTo: {
    type: String,
    validate: {
      validator: function (v) {
        return ObjectId.isValid(v);
      },
    },
  },
  date: {
    type: Number,
    required: true,
    default: () => {
      return parseInt(new Date().getTime().toString());
    },
  },
});
module.exports = schema;
