const chatRepository = require("../repositories/chat");
class ChatService {
  #chatRepository = new chatRepository();
  async sendMessage(senderId, recieveId, message, date) {
    if (await this.#chatRepository.checkChatExists(senderId, recieveId)) {
      return await this.#chatRepository.sendMessage(
        senderId,
        recieveId,
        message,
        date
      );
    } else {
      return await this.#chatRepository.startChat(
        senderId,
        recieveId,
        message,
        date
      );
    }
  }
  async getMessages(userOne, userTwo) {
    return await this.#chatRepository.getMessages(userOne, userTwo);
  }
  async seenMessages(userOne, userTwo) {
    return await this.#chatRepository.seenMessages(userOne, userTwo);
  }
  async getUsersChats(userId) {
    return await this.#chatRepository.getUsersChats(userId);
  }
}
module.exports = ChatService;
