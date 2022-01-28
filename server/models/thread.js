const mongoose = require("mongoose");
const threadPost = require("./threadPost");
const schema = new mongoose.Schema({
  topic: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
  threadPosts: [threadPost],
  dateStarted: {
    type: Number,
    required: true,
    default: () => {
      return new Date().getTime();
    },
  },
  dateLastActivity: {
    type: Number,
    required: true,
    default: () => {
      return new Date().getTime();
    },
  },
});
module.exports = mongoose.model("Thread", schema);
