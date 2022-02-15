"use strict";
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const extensionMethods = require("../extensionMethods");
const FundrisingCampaignRepository = require("../repositories/fundrisingCampaign");
class FundrisingCampaignService {
  #fundrisingCampaignRepository = new FundrisingCampaignRepository();
  async createFundrisingCampaign(campaign) {
    campaign.photos = [];
    campaign.photosDataURL.forEach((photo) => {
      let imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
        8
      )}.webp`;
      let dir = `${path.dirname(require.main.filename)}/img`;
      while (fs.existsSync(`${dir}\\${imgFileName}`)) {
        imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
          8
        )}.webp}`;
      }
      let base64Data = photo.split("base64,")[1];
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      sharp(Buffer.from(base64Data, "base64"))
        .webp()
        .toFile(`${dir}/${imgFileName}`);
      campaign.photos.push(imgFileName);
    });
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
    let base64Data = campaign.mainPhotoDataURL.split("base64,")[1];
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    sharp(Buffer.from(base64Data, "base64"))
      .webp()
      .toFile(`${dir}/${imgFileName}`);
    campaign.mainPhoto = imgFileName;
    campaign.mainPhotoDataURL = undefined;
    return await this.#fundrisingCampaignRepository.createFundrisingCampaign(
      campaign
    );
  }
}
module.exports = FundrisingCampaignService;
