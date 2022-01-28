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
}
module.exports = ThreadService;
