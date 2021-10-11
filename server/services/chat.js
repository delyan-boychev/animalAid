const chatRepository = require("../repositories/chat");
const userRepository = require("../repositories/user");
class ChatService {
  #chatRepository = new chatRepository();
  #userRepository = new userRepository();
  async sendMessage(senderId, recieveId, message, date) {
    const usersExists =
      (await this.#userRepository.checkUserExists(senderId)) &&
      (await this.#userRepository.checkUserExists(recieveId));
    if (usersExists) {
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
    } else {
      return false;
    }
  }
  async getMessages(userOne, userTwo) {
    const usersExists =
      (await this.#userRepository.checkUserExists(userOne)) &&
      (await this.#userRepository.checkUserExists(userTwo));
    if (usersExists) {
      return await this.#chatRepository.getMessages(userOne, userTwo);
    } else {
      return false;
    }
  }
  async seenMessages(userOne, userTwo) {
    const usersExists =
      (await this.#userRepository.checkUserExists(userOne)) &&
      (await this.#userRepository.checkUserExists(userTwo));
    if (usersExists) {
      return await this.#chatRepository.seenMessages(userOne, userTwo);
    } else {
      return false;
    }
  }
  async getUsersChats(userId) {
    const userExists = await this.#userRepository.checkUserExists(userId);
    if (userExists) {
      return await this.#chatRepository.getUsersChats(userId);
    } else {
      return false;
    }
  }
}
module.exports = ChatService;
