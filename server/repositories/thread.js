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
    if (topic !== undefined) {
      const threads = await Thread.find({
        topic: { $regex: topic, $options: "i" },
      })
        .populate("author", "name email")
        .select("topic author dateLastActivity")
        .exec();
      return threads;
    } else {
      const threads = await Thread.find()
        .populate("author", "name email")
        .select("topic author dateLastActivity")
        .exec();
      return threads;
    }
  }
  async getThread(threadId) {
    try {
      const thread = await Thread.findById(threadId)
        .populate("author", "-password")
        .select("-threadPosts")
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
  async getThreadPosts(threadId) {
    const thread = await Thread.findById(threadId)
      .populate(
        "threadPosts.author",
        "-password -__v -_id -createdOn -verified -city"
      )
      .exec();
    if (thread !== null) {
      return thread.threadPosts.map((post) => {
        const p = { ...post.toObject() };
        if (post.replyTo !== undefined) {
          const replyTo = thread.threadPosts.id(post.replyTo);
          if (replyTo !== null) {
            p.replyTo = {
              content: replyTo.content,
              authorFullName: `${replyTo.author.name.first} ${replyTo.author.name.last}`,
              authorEmail: replyTo.author.email,
            };
          }
        }
        return p;
      });
    } else {
      return false;
    }
  }
  async createThreadPost(threadId, author, content, replyTo) {
    try {
      const thread = await Thread.findById(threadId).exec();
      if (thread !== null) {
        if (replyTo !== undefined)
          if (thread.threadPosts.id(replyTo) === null) return false;
        thread.threadPosts.push({ author, content, replyTo });
        thread.dateLastActivity = parseInt(new Date().getTime().toString());
        thread.save();
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
}
module.exports = ThreadRepository;
