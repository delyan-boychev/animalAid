"use strict";
const Forum = require("../models/forum");
class ForumRepository {
  async createForum(topic, description, author) {
    let forum = new Forum();
    forum.topic = topic;
    forum.description = description;
    forum.author = author;
    try {
      await forum.save();
      return true;
    } catch {
      return false;
    }
  }
}
module.exports = ForumRepository;
