"use strict";
const path = require("path");
const nodemailer = require("nodemailer");
const config = require("../config.json");
const fs = require("fs");
const sharp = require("sharp");
const extensionMethods = require("../extensionMethods");
const verifiedFundrisingCampaign = require("../models/emailTemplates/verifiedFundrisingCampaign");
const AdminRepository = require("../repositories/admin");
const transportMail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_INFO.EMAIL,
    pass: config.EMAIL_INFO.PASSWORD,
  },
});
const fromSender = config.EMAIL_INFO.EMAIL_SENDER;
class AdminService {
  #adminRepository = new AdminRepository();
  /**
   * Moderation verify vet
   * @param {String} email Vet email
   * @returns {Boolean}
   */
  async moderationVerifyVet(email) {
    return await this.#adminRepository.moderationVerifyVet(email);
  }
  /**
   * Get all users
   * @param {Number} pageNum Page number
   * @param {String} searchQuery Search query
   * @returns {Object[]}
   */
  async getAllUsers(pageNum, searchQuery, role, excludeId) {
    const users = await this.#adminRepository.getAllUsers(
      searchQuery,
      role,
      excludeId
    );
    if (users !== false) {
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
    } else {
      return false;
    }
  }
  /**
   * Get vets for moderation verify
   * @param {Number} pageNum
   * @returns {Object[]}
   */
  async getVetsForModerationVerify(pageNum) {
    const vets = await this.#adminRepository.getVetsForModerationVerify();
    if (vets !== false) {
      const startIndex = pageNum * 10 - 10;
      const endIndex = pageNum * 10;
      const numPages = Math.ceil(vets.length / 10);
      if (
        pageNum < 1 ||
        (vets.length < endIndex && vets.length < startIndex) ||
        pageNum > numPages
      ) {
        return false;
      } else if (vets.length < endIndex && vets.length > startIndex) {
        return { vets: vets.slice(startIndex, vets.length), numPages };
      } else {
        return { vets: vets.slice(startIndex, endIndex), numPages };
      }
    } else {
      return false;
    }
  }
  /**
   * Get user info
   * @param {String} id User id
   * @returns {Object}
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
   * @param {Object} img Data url img and crop
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
  /**
   * Delete thread
   * @param {String} threadId
   * @returns {Boolean}
   */
  async deleteThread(threadId) {
    return await this.#adminRepository.deleteThread(threadId);
  }
  /**
   * Delete thread post
   * @param {String} threadId
   * @param {String} postId
   * @returns {Boolean}
   */
  async deleteThreadPost(threadId, postId) {
    return await this.#adminRepository.deleteThreadPost(threadId, postId);
  }
  /**
   * Moderation verify fundrising campaign
   * @param {String} campaignId
   * @returns {Boolean}
   */
  async moderationVerifyFundrisingCampaign(campaignId) {
    const campaign =
      await this.#adminRepository.moderationVerifyFundrisingCampaign(
        campaignId
      );
    if (campaign !== false) {
      transportMail.sendMail({
        from: fromSender,
        to: campaign.user.email,
        subject: "Одобрена кампания",
        html: verifiedFundrisingCampaign(
          campaign.user.name.first,
          campaign.title
        ),
      });
      return true;
    } else {
      return false;
    }
  }
  /**
   * Complete fudrising campaign
   * @param {String} campaignId
   * @returns {Boolean}
   */
  async completeFundrisingCampaign(campaignId) {
    return await this.#adminRepository.completeFundrisingCampaign(campaignId);
  }
}
module.exports = AdminService;
