"use strict";
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const extensionMethods = require("../extensionMethods");
const AdminRepository = require("../repositories/admin");
class AdminService {
  #adminRepository = new AdminRepository();
  /**
   * Moderation verify vet
   * @param {String} email Vet email
   * @returns {Boolean}
   */
  async moderationVerify(email) {
    return await this.#adminRepository.moderationVerify(email);
  }
  /**
   * Get all users
   * @param {Number} pageNum Page number
   * @param {{}} searchQuery Search query
   * @returns {{}}
   */
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
  /**
   * Get user info
   * @param {String} id User id
   * @returns {{}}
   */
  async getUserInfo(id) {
    return await this.#adminRepository.getProfile(id);
  }
  /**
   * Change user role
   * @param {String} id User id
   * @param {String} newRole New role
   * @returns {Boolean}
   */
  async changeRole(id, newRole) {
    return await this.#adminRepository.changeRole(id, newRole);
  }
  /**
   * Edit property profile
   * @param {String} prop Name of the property for edit
   * @param {String} value New value of the property
   * @param {String} id User id
   * @returns {Boolean}
   */
  async editUser(prop, value, id) {
    return await this.#adminRepository.editUser(prop, value, id);
  }
  /**
   * Change profile photo
   * @param {String} id User id
   * @param {{}} img Data url img and crop
   * @returns {Boolean}
   */
  async changeProfilePhoto(img) {
    let imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
      8
    )}.webp`;
    let dir = `${path.dirname(require.main.filename)}/img`;
    while (fs.existsSync(`${dir}\\${imgFileName}`)) {
      imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
        8
      )}.webp`;
    }
    const oldImgFileName = await this.#adminRepository.changeProfilePhoto(
      img.id,
      imgFileName
    );
    if (oldImgFileName !== false) {
      let base64Data = img.imgDataURL.split("base64,")[1];
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      sharp(Buffer.from(base64Data, "base64"))
        .extract({
          top: img.imageCrop.y,
          left: img.imageCrop.x,
          width: img.imageCrop.width,
          height: img.imageCrop.height,
        })
        .webp()
        .toFile(`${dir}/${imgFileName}`, function (err) {
          if (err) console.log(err);
        });
      fs.unlinkSync(`${dir}/${oldImgFileName}`);
      return true;
    } else {
      return false;
    }
  }
}
module.exports = AdminService;
