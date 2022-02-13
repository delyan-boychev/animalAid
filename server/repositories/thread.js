"use strict";
const Thread = require("../models/thread");
class ThreadRepository {
  /**
   * Create thread
   * @param {String} topic
   * @param {String} description
   * @param {String} author
   * @returns {Boolean}
   */
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
  /**
   * Get all threads by topic search
   * @param {String} topic
   * @returns {[]}
   */
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
  /**
   * Get thread by id
   * @param {String} threadId
   * @returns {{}|Boolean}
   */
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
  /**
   * Get thread posts
   * @param {String} threadId
   * @returns {[]|Boolean}
   */
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
  /**
   * Create thread post
   * @param {String} threadId
   * @param {String} author
   * @param {String} content
   * @param {String} replyTo
   * @returns {Boolean}
   */
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
  /**
   * Edit threads
   * @param {String} threadId
   * @param {String} authorId
   * @param {String} topic
   * @param {String} description
   * @returns {Boolean}
   */
  async editThread(threadId, authorId, topic, description) {
    try {
      const thread = await Thread.findOne({
        _id: threadId,
        author: authorId,
      }).exec();
      if (thread !== null) {
        thread.topic = topic;
        thread.description = description;
        await thread.save();
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
  /**
   * Edit thread post
   * @param {String} threadId
   * @param {String} postId
   * @param {String} authorPostId
   * @param {String} content
   * @returns {Boolean}
   */
  async editThreadPost(threadId, postId, authorPostId, content) {
    try {
      const thread = await Thread.findOne({
        _id: threadId,
      }).exec();
      if (thread !== null) {
        let post = thread.threadPosts.id(postId);
        if (post !== null) {
          if (post.author == authorPostId) {
            thread.threadPosts.id(postId).content = content;
            await thread.save();
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
}
module.exports = ThreadRepository;
