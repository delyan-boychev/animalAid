const mongoose = require("mongoose");
const forumReply = require("./forumReply");
const schema = new mongoose.Schema({
  topic: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
  forumReplies: [forumReply],
  dateStarted: {
    type: Number,
    required: true,
    default: parseInt(new Date().getTime().toString()),
  },
  dateLastActivity: {
    type: Number,
    required: true,
    default: parseInt(new Date().getTime().toString()),
  },
});
module.exports = mongoose.model("Forum", schema);
