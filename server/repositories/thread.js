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
  async getAllThreads(topic) {
    const threads = await Thread.find({ topic })
      .populate("author")
      .select(["topic", "author"])
      .exec();
    return threads;
  }
  async getThread(id) {
    try {
      const thread = await Thread.findById(id)
        .populate("author", "-password")
        .populate("threadPosts.author", "-password")
        .populate("threadPosts.replies.author", "-password")
        .exec();
      if (thread !== null) {
        return thread;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
  async createThreadPost(threadId, author, content) {
    const thread = await Thread.findById(threadId).exec();
    if (thread !== null) {
      thread.threadPosts.push({ author, content });
      try {
        thread.save();
        return true;
      } catch {
        return false;
      }
    } else {
      return false;
    }
  }
  async replyToPost(threadId, postId, author, reply) {
    const thread = await Thread.findById(threadId).exec();
    if (thread !== null) {
      const postIndex = thread.threadPosts.findIndex((post) =>
        post._id.equals(postId)
      );
      if (postIndex > -1) {
        thread.threadPosts[postIndex].replies.push({ author, reply });
        try {
          thread.save();
          return true;
        } catch {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
}
module.exports = ThreadRepository;
