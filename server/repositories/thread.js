"use strict";
const Thread = require("../models/thread");
class ThreadRepository {
  async createThread(topic, description, author) {
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
  async createThreadPost(id, author, content) {
    const thread = Thread.findById(id);
    if (thread !== null) {
      thread.posts.push({ author, content });
      thread.save();
    } else {
      return false;
    }
  }
}
module.exports = ThreadRepository;
