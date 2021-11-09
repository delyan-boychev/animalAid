const chatRepository = require("../repositories/chat");
const userRepository = require("../repositories/user");
class ChatService {
  #chatRepository = new chatRepository();
  #userRepository = new userRepository();
  async sendMessage(senderId, recieveId, message, date, startChat) {
    const usersExists =
      (await this.#userRepository.checkUserExists(senderId)) &&
      (await this.#userRepository.checkUserExists(recieveId));
    if (usersExists) {
      if (await this.#chatRepository.checkChatExists(senderId, recieveId)) {
        if (!startChat) {
          return await this.#chatRepository.sendMessage(
            senderId,
            recieveId,
            message,
            date
          );
        } else {
          return false;
        }
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
  async getMessages(userOne, userTwo, pageNum) {
    const usersExists =
      (await this.#userRepository.checkUserExists(userOne)) &&
      (await this.#userRepository.checkUserExists(userTwo));
    if (usersExists) {
      const messages = await this.#chatRepository.getMessages(userOne, userTwo);
      const startIndex = messages.length - pageNum * 10;
      const endIndex = messages.length - (pageNum - 1) * 10;
      const numPages = Math.ceil(messages.length / 10);
      if (
        pageNum < 1 ||
        (messages.length < endIndex && messages.length < startIndex)
      ) {
        return false;
      } else if (startIndex < 0 && endIndex > 0) {
        return { messages: messages.slice(0, endIndex), numPages };
      } else {
        return { messages: messages.slice(startIndex, endIndex), numPages };
      }
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
  async getProfile(userId) {
    const user = await this.#userRepository.getProfile(userId);
    if (user !== {}) {
      return user;
    }
  }
}
module.exports = ChatService;
