"use strict";
const path = require("path");
const nodemailer = require("nodemailer");
const config = require("../config.json");
const fs = require("fs");
const sharp = require("sharp");
const extensionMethods = require("../extensionMethods");
const createdFundrisingCampaign = require("../models/emailTemplates/createdFunrisingCampaign");
const FundrisingCampaignRepository = require("../repositories/fundrisingCampaign");
const UserRepository = require("../repositories/user");
const transportMail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_INFO.EMAIL,
    pass: config.EMAIL_INFO.PASSWORD,
  },
});
const fromSender = config.EMAIL_INFO.EMAIL_SENDER;
class FundrisingCampaignService {
  #fundrisingCampaignRepository = new FundrisingCampaignRepository();
  #userRepository = new UserRepository();
  /**
   * Create fundrising campaign
   * @param {Object} campaign
   * @returns {Boolean}
   */
  async createFundrisingCampaign(campaign) {
    campaign.photos = [];
    campaign.photosDataURL.forEach(() => {
      let imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
        8
      )}.webp`;
      let dir = `${path.dirname(require.main.filename)}/img`;
      while (fs.existsSync(`${dir}\\${imgFileName}`)) {
        imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
          8
        )}.webp}`;
      }
      campaign.photos.push(imgFileName);
    });
    const photosDataURL = campaign.photosDataURL;
    campaign.photosDataURL = undefined;
    let imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
      8
    )}.webp`;
    let dir = `${path.dirname(require.main.filename)}/img`;
    while (fs.existsSync(`${dir}\\${imgFileName}`)) {
      imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
        8
      )}.webp}`;
    }
    campaign.mainPhoto = imgFileName;
    const mainPhotoDataURL = campaign.mainPhotoDataURL;
    campaign.mainPhotoDataURL = undefined;
    const created =
      await this.#fundrisingCampaignRepository.createFundrisingCampaign(
        campaign
      );
    if (created === true) {
      const user = await this.#userRepository.getProfile(campaign.user);
      transportMail.sendMail({
        from: fromSender,
        to: user.email,
        subject: "Успешно създадена кампания",
        html: createdFundrisingCampaign(user.name.first, campaign.title),
      });
      photosDataURL.forEach((photo, index) => {
        let base64Data = photo.split("base64,")[1];
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        sharp(Buffer.from(base64Data, "base64"))
          .webp()
          .toFile(`${dir}/${campaign.photos[index]}`);
      });
      let base64Data = mainPhotoDataURL.split("base64,")[1];
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      sharp(Buffer.from(base64Data, "base64"))
        .webp()
        .toFile(`${dir}/${campaign.mainPhoto}`);
    }
    return created;
  }
  /**
   * Get all fundrising campaigns
   * @param {String} searchQuery
   * @param {Number} pageNum
   * @returns {Object[]|Boolean}
   */
  async getAllCampaigns(searchQuery, pageNum) {
    const campaigns = await this.#fundrisingCampaignRepository.getAllCampaigns(
      searchQuery
    );
    const startIndex = pageNum * 10 - 10;
    const endIndex = pageNum * 10;
    const numPages = Math.ceil(campaigns.length / 10);
    if (
      pageNum < 1 ||
      (campaigns.length < endIndex && campaigns.length < startIndex) ||
      pageNum > numPages
    ) {
      return false;
    } else if (campaigns.length < endIndex && campaigns.length > startIndex) {
      return {
        campaigns: campaigns.slice(startIndex, campaigns.length),
        numPages,
      };
    } else {
      return { campaigns: campaigns.slice(startIndex, endIndex), numPages };
    }
  }
  /**
   * Complete fudrising campaign
   * @param {String} campaignId
   * @param {String} userId
   * @returns {Boolean}
   */
  async completeFundrisingCampaign(campaignId, userId) {
    return await this.#fundrisingCampaignRepository.completeFundrisingCampaign(
      campaignId,
      userId
    );
  }
  /**
   * Get fundrising campaign
   * @param {String} id
   * @returns {Object}
   */
  async getFundrisingCampaign(id) {
    return await this.#fundrisingCampaignRepository.getFundrisingCampaign(id);
  }
}
module.exports = FundrisingCampaignService;
