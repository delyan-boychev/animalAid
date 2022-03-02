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
const getPageFromArr = require("../extensionMethods").getPageFromArr;
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
    let dirImg = `${path.dirname(require.main.filename)}/img`;
    let dirDocs = `${path.dirname(require.main.filename)}/documents`;
    campaign.photosDataURL.forEach(() => {
      let imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
        8
      )}.webp`;
      while (fs.existsSync(`${dirImg}\\${imgFileName}`)) {
        imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
          8
        )}.webp}`;
      }
      campaign.photos.push(imgFileName);
    });
    campaign.documentsForPayment = [];
    campaign.documentsForPaymentURL.forEach(() => {
      let imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
        8
      )}.webp`;
      while (fs.existsSync(`${dirDocs}\\${imgFileName}`)) {
        imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
          8
        )}.webp}`;
      }
      campaign.documentsForPayment.push(imgFileName);
    });
    let imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
      8
    )}.webp`;
    while (fs.existsSync(`${dirImg}\\${imgFileName}`)) {
      imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
        8
      )}.webp}`;
    }
    campaign.mainPhoto = imgFileName;
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
      campaign.photosDataURL.forEach((photo, index) => {
        let base64Data = photo.split("base64,")[1];
        if (!fs.existsSync(dirImg)) {
          fs.mkdirSync(dirImg);
        }
        sharp(Buffer.from(base64Data, "base64"))
          .webp()
          .toFile(`${dirImg}/${campaign.photos[index]}`);
      });
      campaign.documentsForPaymentURL.forEach((photo, index) => {
        let base64Data = photo.split("base64,")[1];
        if (!fs.existsSync(dirDocs)) {
          fs.mkdirSync(dirDocs);
        }
        sharp(Buffer.from(base64Data, "base64"))
          .webp()
          .toFile(`${dirDocs}/${campaign.documentsForPayment[index]}`);
      });
      let base64Data = campaign.mainPhotoDataURL.split("base64,")[1];
      if (!fs.existsSync(dirImg)) {
        fs.mkdirSync(dirImg);
      }
      sharp(Buffer.from(base64Data, "base64"))
        .extract({
          top: campaign.mainPhotoCrop.y,
          left: campaign.mainPhotoCrop.x,
          width: campaign.mainPhotoCrop.width,
          height: campaign.mainPhotoCrop.height,
        })
        .webp()
        .toFile(`${dirImg}/${campaign.mainPhoto}`);
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
    return getPageFromArr(campaigns, 12, pageNum, "campaigns");
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
