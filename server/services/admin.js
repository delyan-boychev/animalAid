"use strict";
const AdminRepository = require("../repositories/admin");
class AdminService {
  #adminRepository = new AdminRepository();
  async moderationVerify(email) {
    return await this.#adminRepository.moderationVerify(email);
  }
  async getAllUsers(pageNum, searchQuery) {
    const users = await this.#adminRepository.getAllUsers(searchQuery);
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
  async getUserInfo(id) {
    return await this.#adminRepository.getProfile(id);
  }
  async changeRole(id, newRole) {
    return await this.#adminRepository.changeRole(id, newRole);
  }
  async editUser(prop, value, id) {
    return await this.#adminRepository.editUser(prop, value, id);
  }
}
module.exports = AdminService;
