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
  async getThread(threadId) {
    try {
      const thread = await Thread.findById(threadId)
        .populate("author", "-password")
        .select(["-posts"])
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
      .lean()
      .exec();
    if (thread !== null) {
      return thread.threadPosts.map((post) => {
        if (post.replyTo !== undefined)
          if (typeof thread.threadPosts[post.replyTo] !== "undefined")
            post.replyTo = {
              content: thread.threadPosts[post.replyTo].content,
              authorFullName: `${
                thread.threadPosts[post.replyTo].author.name.first
              } ${thread.threadPosts[post.replyTo].author.name.last}`,
            };
        return post;
      });
    } else {
      return false;
    }
  }
  async createThreadPost(threadId, author, content, replyTo) {
    const thread = await Thread.findById(threadId).exec();
    if (thread !== null) {
      if (replyTo !== undefined)
        if (typeof thread.threadPosts[replyTo] === "undefined") return false;
      thread.threadPosts.push({ author, content, replyTo });
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
}
module.exports = ThreadRepository;
