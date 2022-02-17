"use strict";
const ThreadRepository = require("../repositories/thread");
class ThreadService {
  #threadRepository = new ThreadRepository();
  /**
   * Create thread
   * @param {String} topic
   * @param {String} description
   * @param {String} author
   * @returns {Boolean}
   */
  async createThread(topic, description, author) {
    return await this.#threadRepository.createThread(
      topic,
      description,
      author
    );
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
    return await this.#threadRepository.createThreadPost(
      threadId,
      author,
      content,
      replyTo
    );
  }
  /**
   *
   * @param {String} id
   * @returns {Object|Boolean}
   */
  async getThread(id) {
    return await this.#threadRepository.getThread(id);
  }
  async getAllThreads(topic, pageNum) {
    const threads = await this.#threadRepository.getAllThreads(topic);
    const startIndex = pageNum * 10 - 10;
    const endIndex = pageNum * 10;
    const numPages = Math.ceil(threads.length / 10);
    if (
      pageNum < 1 ||
      (threads.length < endIndex && threads.length < startIndex) ||
      pageNum > numPages
    ) {
      return false;
    } else if (threads.length < endIndex && threads.length > startIndex) {
      return { threads: threads.slice(startIndex, threads.length), numPages };
    } else {
      return { threads: threads.slice(startIndex, endIndex), numPages };
    }
  }
  async getThreadPosts(id, pageNum) {
    const posts = await this.#threadRepository.getThreadPosts(id);
    if (posts !== false) {
      const startIndex = pageNum * 10 - 10;
      const endIndex = pageNum * 10;
      const numPages = Math.ceil(posts.length / 10);
      if (numPages === 0) {
        return { posts: [], numPages: 0 };
      } else if (
        pageNum < 1 ||
        (posts.length < endIndex && posts.length < startIndex) ||
        pageNum > numPages
      ) {
        return false;
      } else if (posts.length < endIndex && posts.length > startIndex) {
        return { posts: posts.slice(startIndex, posts.length), numPages };
      } else {
        return { posts: posts.slice(startIndex, endIndex), numPages };
      }
    } else {
      return false;
    }
  }
  async editThread(threadId, authorId, topic, description) {
    return await this.#threadRepository.editThread(
      threadId,
      authorId,
      topic,
      description
    );
  }
  async editThreadPost(threadId, postId, authorPostId, content, replyTo) {
    return await this.#threadRepository.editThreadPost(
      threadId,
      postId,
      authorPostId,
      content,
      replyTo
    );
  }
  async getThreadForEdit(threadId, authorId) {
    return await this.#threadRepository.getThreadForEdit(threadId, authorId);
  }
}
module.exports = ThreadService;
