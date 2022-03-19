"use strict";
const ThreadRepository = require("../repositories/thread");
const getPageFromArr = require("../extensionMethods").getPageFromArr;
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
  /**
   * Get all threads
   * @param {String} topic
   * @param {Number} pageNum
   * @returns {Object|Boolean}
   */
  async getAllThreads(topic, pageNum) {
    const threads = await this.#threadRepository.getAllThreads(topic);
    return getPageFromArr(threads, 10, pageNum, "threads");
  }
  /**
   * Get all thread posts
   * @param {String} id
   * @param {Number} pageNum
   * @returns {Object|Boolean}
   */
  async getThreadPosts(id, pageNum) {
    const posts = await this.#threadRepository.getThreadPosts(id);
    if (posts !== false) {
      const page = getPageFromArr(posts, 10, pageNum, "posts");
      if (page === false) {
        return { posts: [], numPages: 0 };
      } else {
        return page;
      }
    } else {
      return false;
    }
  }
  /**
   * Edit thread
   * @param {String} threadId
   * @param {String} authorId
   * @param {String} topic
   * @param {String} description
   * @returns {Boolean}
   */
  async editThread(threadId, authorId, topic, description) {
    return await this.#threadRepository.editThread(
      threadId,
      authorId,
      topic,
      description
    );
  }
  /**
   * Edit thread post
   * @param {String} threadId
   * @param {String} postId
   * @param {String} authorPostId
   * @param {String} content
   * @param {String} replyTo
   * @returns {Boolean}
   */
  async editThreadPost(threadId, postId, authorPostId, content, replyTo) {
    return await this.#threadRepository.editThreadPost(
      threadId,
      postId,
      authorPostId,
      content,
      replyTo
    );
  }
  /**
   * Get thread for edit
   * @param {String} threadId
   * @param {String} authorId
   * @returns
   */
  async getThreadForEdit(threadId, authorId) {
    return await this.#threadRepository.getThreadForEdit(threadId, authorId);
  }
}
module.exports = ThreadService;
