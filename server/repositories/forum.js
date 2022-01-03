"use strict";
const Thread = require("../models/thread");
class ForumRepository {
  async createForum(topic, description, author) {
    let thread = new Thread();
    thread.topic = topic;
    thread.description = description;
    thread.author = author;
    try {
      await thread.save();
      return true;
    } catch {
      return false;
    }
  }
}
module.exports = ForumRepository;
