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
    try {
      const thread = await Thread.findById(threadId)
        .populate("posts.author", "-password")
        .exec();
      if (thread !== null) {
        return thread.posts;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
  async getThreadPostReplies(threadId, postId) {
    try {
      const thread = await Thread.findById(threadId)
        .populate("posts.replies.author", "-password")
        .exec();
      if (thread !== null) {
        const postIndex = thread.threadPosts.findIndex((post) =>
          post._id.equals(postId)
        );
        if (postIndex > -1) {
          return thread.threadPosts[postIndex].replies;
        } else {
          return true;
        }
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
