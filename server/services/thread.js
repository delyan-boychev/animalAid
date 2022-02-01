"use strict";
const ThreadRepository = require("../repositories/thread");
class ThreadService {
  #threadRepository = new ThreadRepository();
  async createThread(topic, description, author) {
    return await this.#threadRepository.createThread(
      topic,
      description,
      author
    );
  }
  async createThreadPost(threadId, author, content) {
    return await this.#threadRepository.createThreadPost(
      threadId,
      author,
      content
    );
  }
  async replyToPost(threadId, postId, author, reply) {
    return await this.#threadRepository.replyToPost(
      threadId,
      postId,
      author,
      reply
    );
  }
  async getThread(id) {
    return await this.#threadRepository.getThread(id);
  }
  async getThreadPosts(id, pageNum) {
    const posts = this.#threadRepository.getThreadPosts(id);
    const startIndex = pageNum * 10 - 10;
    const endIndex = pageNum * 10;
    const numPages = Math.ceil(posts.length / 10);
    if (
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
  }
}
module.exports = ThreadService;
