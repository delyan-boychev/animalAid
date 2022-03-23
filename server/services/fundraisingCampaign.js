"use strict";
const path = require("path");
const nodemailer = require("nodemailer");
const config = require("../config.json");
const fs = require("fs");
const sharp = require("sharp");
const extensionMethods = require("../extensionMethods");
const createdFundraisingCampaign = require("../models/emailTemplates/createdFunraisingCampaign");
const FundraisingCampaignRepository = require("../repositories/fundraisingCampaign");
const UserRepository = require("../repositories/user");
const dirImg = `${path.dirname(require.main.filename)}/img`;
const dirDocs = `${path.dirname(require.main.filename)}/documents`;
const transportMail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_INFO.EMAIL,
    pass: config.EMAIL_INFO.PASSWORD,
  },
});
const fromSender = config.EMAIL_INFO.EMAIL_SENDER;
const getPageFromArr = require("../extensionMethods").getPageFromArr;
class FundraisingCampaignService {
  #fundraisingCampaignRepository = new FundraisingCampaignRepository();
  #userRepository = new UserRepository();
  /**
   * Create fundraising campaign
   * @param {Object} campaign
   * @returns {Boolean}
   */
  async createFundraisingCampaign(campaign) {
    campaign.photos = [];
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
    campaign.documentsForPaymentDataURL.forEach(() => {
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
      await this.#fundraisingCampaignRepository.createFundraisingCampaign(
        campaign
      );
    if (created === true) {
      const user = await this.#userRepository.getProfile(campaign.user);
      transportMail.sendMail({
        from: fromSender,
        to: user.email,
        subject: "Успешно създадена кампания",
        html: createdFundraisingCampaign(user.name.first, campaign.title),
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
      campaign.documentsForPaymentDataURL.forEach((photo, index) => {
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
   * Get all fundraising campaigns
   * @param {String} searchQuery
   * @param {Number} pageNum
   * @returns {Object|Boolean}
   */
  async getAllCampaigns(searchQuery, pageNum) {
    const campaigns = await this.#fundraisingCampaignRepository.getAllCampaigns(
      searchQuery
    );
    return getPageFromArr(campaigns, 12, pageNum, "campaigns");
  }
  /**
   * Get campaigns by user id
   * @param {String} id
   * @param {Number} pageNum
   * @returns {Object|Boolean}
   */
  async getCampaignsByUser(id, pageNum) {
    const campaigns =
      await this.#fundraisingCampaignRepository.getCampaignsByUser(id, pageNum);
    if (campaigns !== false) {
      return getPageFromArr(campaigns, 12, pageNum, "campaigns");
    } else {
      return false;
    }
  }
  /**
   * Complete fudraising campaign
   * @param {String} campaignId
   * @param {String} userId
   * @returns {Boolean}
   */
  async completeFundraisingCampaign(campaignId, userId) {
    return await this.#fundraisingCampaignRepository.completeFundraisingCampaign(
      campaignId,
      userId
    );
  }
  /**
   * Send campaign for verification
   * @param {String} campaignId
   * @param {String} userId
   * @returns {Boolean}
   */
  async sendCampaignForVerification(campaignId, userId) {
    return await this.#fundraisingCampaignRepository.sendCampaignForVerification(
      campaignId,
      userId
    );
  }
  /**
   * Get fundraising campaign
   * @param {String} id
   * @returns {Object}
   */
  async getFundraisingCampaign(id) {
    return await this.#fundraisingCampaignRepository.getFundraisingCampaign(id);
  }
  /**
   * Get fundraising campaign by user id
   * @param {String} campaignId
   * @param {String} userId
   * @returns {Object|Boolean}
   */
  async getFundraisingCampaignByUser(campaignId, userId) {
    return this.#fundraisingCampaignRepository.getFundraisingCampaignByUser(
      campaignId,
      userId
    );
  }
  /**
   * Check document file permission
   * @param {String} campaignId
   * @param {String} userId
   * @param {String} documentFileName
   * @returns {Boolean}
   */
  async checkDocument(campaignId, userId, documentFileName) {
    return await this.#fundraisingCampaignRepository.checkDocument(
      campaignId,
      userId,
      documentFileName
    );
  }
  /**
   * Edit fundraising campaign
   * @param {String} userId
   * @param {String} campaignId
   * @param {String} prop
   * @param {Object} value
   * @returns {Boolean}
   */
  async editFundraisingCampaign(userId, campaignId, prop, value) {
    switch (prop) {
      case "mainPhotoDataURL": {
        let imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
          8
        )}.webp`;
        while (fs.existsSync(`${dirImg}\\${imgFileName}`)) {
          imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
            8
          )}.webp}`;
        }
        const oldCampaign =
          await this.#fundraisingCampaignRepository.editFunraisingCampaign(
            userId,
            campaignId,
            "mainPhoto",
            imgFileName
          );
        if (oldCampaign !== false) {
          let base64Data = value.mainPhotoDataURL.split("base64,")[1];
          if (!fs.existsSync(dirImg)) {
            fs.mkdirSync(dirImg);
          }
          sharp(Buffer.from(base64Data, "base64"))
            .extract({
              top: value.mainPhotoCrop.y,
              left: value.mainPhotoCrop.x,
              width: value.mainPhotoCrop.width,
              height: value.mainPhotoCrop.height,
            })
            .webp()
            .toFile(`${dirImg}/${imgFileName}`);
          if (fs.existsSync(`${dirImg}/${oldCampaign.mainPhoto}`)) {
            fs.unlinkSync(`${dirImg}/${oldCampaign.mainPhoto}`);
          }
          return true;
        } else {
          return false;
        }
      }
      case "photosDataURL": {
        let photos = [];
        value.forEach(() => {
          let imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
            8
          )}.webp`;
          while (fs.existsSync(`${dirImg}\\${imgFileName}`)) {
            imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
              8
            )}.webp}`;
          }
          photos.push(imgFileName);
        });
        const oldCampaign =
          await this.#fundraisingCampaignRepository.editFunraisingCampaign(
            userId,
            campaignId,
            "photos",
            photos
          );
        if (oldCampaign !== false) {
          value.forEach((photo, index) => {
            let base64Data = photo.split("base64,")[1];
            if (!fs.existsSync(dirImg)) {
              fs.mkdirSync(dirImg);
            }
            sharp(Buffer.from(base64Data, "base64"))
              .webp()
              .toFile(`${dirImg}/${photos[index]}`);
          });
          oldCampaign.photos.forEach((photo) => {
            if (fs.existsSync(`${dirImg}/${photo}`)) {
              fs.unlinkSync(`${dirImg}/${photo}`);
            }
          });
          return true;
        } else {
          return false;
        }
      }
      case "documentsForPaymentDataURL": {
        let photos = [];
        value.forEach(() => {
          let imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
            8
          )}.webp`;
          while (fs.existsSync(`${dirDocs}\\${imgFileName}`)) {
            imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
              8
            )}.webp}`;
          }
          photos.push(imgFileName);
        });
        const oldCampaign =
          await this.#fundraisingCampaignRepository.editFunraisingCampaign(
            userId,
            campaignId,
            "documentsForPayment",
            photos
          );
        if (oldCampaign !== false) {
          value.forEach((photo, index) => {
            let base64Data = photo.split("base64,")[1];
            if (!fs.existsSync(dirDocs)) {
              fs.mkdirSync(dirDocs);
            }
            sharp(Buffer.from(base64Data, "base64"))
              .webp()
              .toFile(`${dirDocs}/${photos[index]}`);
          });
          oldCampaign.documentsForPayment.forEach((photo) => {
            if (fs.existsSync(`${dirDocs}/${photo}`)) {
              fs.unlinkSync(`${dirDocs}/${photo}`);
            }
          });
          return true;
        } else {
          return false;
        }
      }
      default: {
        const oldCampaign =
          await this.#fundraisingCampaignRepository.editFunraisingCampaign(
            userId,
            campaignId,
            prop,
            value
          );
        if (oldCampaign !== false) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
}
module.exports = FundraisingCampaignService;
