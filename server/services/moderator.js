"use strict";
const nodemailer = require("nodemailer");
const config = require("../config.json");
const getPageFromArr = require("../extensionMethods").getPageFromArr;
const verifiedFundraisingCampaign = require("../models/emailTemplates/verifiedFundraisingCampaign");
const rejectedFundraisingCampaign = require("../models/emailTemplates/rejectedFundraisingCampaign");
const ModeratorRepository = require("../repositories/moderator");
const transportMail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_INFO.EMAIL,
    pass: config.EMAIL_INFO.PASSWORD,
  },
});
const fromSender = config.EMAIL_INFO.EMAIL_SENDER;
class ModeratorService {
  #moderatorRepository = new ModeratorRepository();
  /**
   * Moderation verify vet
   * @param {String} email Vet email
   * @returns {Boolean}
   */
  async moderationVerifyVet(email) {
    return await this.#moderatorRepository.moderationVerifyVet(email);
  }
  /**
   * Get all users
   * @param {Number} pageNum Page number
   * @param {String} searchQuery Search query
   * @returns {Object[]}
   */
  async getAllUsers(pageNum, searchQuery, role, excludeId) {
    const users = await this.#moderatorRepository.getAllUsers(
      searchQuery,
      role,
      excludeId
    );
    if (users !== false) {
      return getPageFromArr(users, 10, pageNum, "users");
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
    const vets = await this.#moderatorRepository.getVetsForModerationVerify();
    if (vets !== false) {
      return getPageFromArr(vets, 10, pageNum, "vets");
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
    return await this.#moderatorRepository.getProfile(id);
  }
  /**
   * Change user role
   * @param {String} id User id
   * @param {String} newRole New role
   * @returns {Boolean}
   */
  async changeRole(id, newRole) {
    return await this.#moderatorRepository.changeRole(id, newRole);
  }
  /**
   * Deactivate profile
   * @param {String} id
   * @returns {Boolean}
   */
  async deactivateProfile(id) {
    return await this.#moderatorRepository.deactivateProfile(id);
  }
  /**
   * Activate profile
   * @param {String} id
   * @returns {Boolean}
   */
  async activateProfile(id) {
    return await this.#moderatorRepository.activateProfile(id);
  }
  /**
   * Delete thread
   * @param {String} threadId
   * @returns {Boolean}
   */
  async deleteThread(threadId) {
    return await this.#moderatorRepository.deleteThread(threadId);
  }
  /**
   * Delete thread post
   * @param {String} threadId
   * @param {String} postId
   * @returns {Boolean}
   */
  async deleteThreadPost(threadId, postId) {
    return await this.#moderatorRepository.deleteThreadPost(threadId, postId);
  }
  /**
   * Get campaign
   * @param {String} campaignId
   * @returns {Object}
   */
  async getCampaign(campaignId) {
    return await this.#moderatorRepository.getCampaign(campaignId);
  }
  /**
   * Get all fundraising campaigns
   * @param {String} searchQuery
   * @param {Number} pageNum
   * @returns {Object|Boolean}
   */
  async getAllCampaigns(searchQuery, pageNum) {
    const campaigns = await this.#moderatorRepository.getAllCampaigns(
      searchQuery
    );
    return getPageFromArr(campaigns, 12, pageNum, "campaigns");
  }
  /**
   * Get campaigns for moderation verify
   * @param {Number} pageNum
   * @returns {Object[]|Boolean}
   */
  async getCampaignsForModerationVerify(pageNum) {
    const campaigns =
      await this.#moderatorRepository.getCampaignsForModerationVerify();
    if (campaigns !== false) {
      return getPageFromArr(campaigns, 12, pageNum, "campaigns");
    } else {
      return false;
    }
  }
  /**
   * Moderation verify fundraising campaign
   * @param {String} campaignId
   * @param {Boolean} verified
   * @param {String} rejectedComment
   * @returns  {Boolean}
   */
  async moderationVerifyFundraisingCampaign(
    campaignId,
    verified,
    rejectedComment
  ) {
    const campaign =
      await this.#moderatorRepository.moderationVerifyFundraisingCampaign(
        campaignId,
        verified,
        rejectedComment
      );
    if (campaign !== false) {
      if (verified === true) {
        transportMail.sendMail({
          from: fromSender,
          to: campaign.user.email,
          subject: "Одобрена кампания",
          html: verifiedFundraisingCampaign(
            campaign.user.name.first,
            campaign.title
          ),
        });
      } else {
        transportMail.sendMail({
          from: fromSender,
          to: campaign.user.email,
          subject: "Отхвърлена кампания",
          html: rejectedFundraisingCampaign(
            campaign.user.name.first,
            campaign.title,
            campaign.rejectedComment
          ),
        });
      }
      return true;
    } else {
      return false;
    }
  }
  /**
   * Complete fudraising campaign
   * @param {String} campaignId
   * @returns {Boolean}
   */
  async completeFundraisingCampaign(campaignId) {
    return await this.#moderatorRepository.completeFundraisingCampaign(
      campaignId
    );
  }
}
module.exports = ModeratorService;
