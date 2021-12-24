"use strict";
const UserRepository = require("../repositories/user");
class AdminService {
  #userRepository = new UserRepository();
  async moderationVerify(email) {
    return await this.#userRepository.moderationVerify(email);
  }
  async getAllUsers() {
    const users = await this.#userRepository.getAllUsers();
    const startIndex = pageNum * 10 - 10;
    const endIndex = pageNum * 10;
    const numPages = Math.ceil(users.length / 10);
    if (
      pageNum < 1 ||
      (users.length < endIndex && users.length < startIndex) ||
      pageNum > numPages
    ) {
      return false;
    } else if (users.length < endIndex && users.length > startIndex) {
      return { users: users.slice(startIndex, users.length), numPages };
    } else {
      return { users: users.slice(startIndex, endIndex), numPages };
    }
  }
}
module.exports = AdminService;