const FundrisingCampaign = require("../models/fundrisingCampaign");
class FundrisingCampaignRepository {
  /**
   * Create fundrising campaign
   * @param {Object} campaign
   * @returns {Boolean}
   */
  async createFundrisingCampaign(campaign) {
    const c = new FundrisingCampaign(campaign);
    try {
      await c.save();
      return true;
    } catch {
      return false;
    }
  }
  /**
   * Complete fudrising campaign
   * @param {String} campaignId
   * @param {String} userId
   * @returns {Boolean}
   */
  async completeFundrisingCampaign(campaignId, userId) {
    try {
      const campaign = await FundrisingCampaign.findOne({
        _id: campaignId,
        user: userId,
      }).exec();
      if (campaign !== null) {
        if (campaign.completed === false) {
          campaign.completed = true;
          campaign.expireAt = parseInt(new Date().getTime() / 1000);
          await campaign.save();
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
  /**
   * Get campaigns by user id
   * @param {String} id
   * @returns {Object[]|Boolean}
   */
  async getCampaignsByUser(id) {
    try {
      return await FundrisingCampaign.find({ user: id })
        .select("title mainPhoto moderationVerified completed rejectedComment")
        .lean()
        .exec();
    } catch {
      return false;
    }
  }
  /**
   * Get all fundrising campaigns
   * @param {String} searchQuery
   * @returns {Object[]}
   */
  async getAllCampaigns(searchQuery) {
    let query = {};
    if (searchQuery !== undefined) {
      query = {
        moderationVerified: true,
        completed: false,
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { shortDescription: { $regex: searchQuery, $options: "i" } },
        ],
      };
    } else {
      query = {
        moderationVerified: true,
        completed: false,
      };
    }
    return await FundrisingCampaign.find(query)
      .select("title shortDescription mainPhoto value paypalDonationURL")
      .lean()
      .exec();
  }
  /**
   * Get fundrising campaign
   * @param {String} id
   * @returns {Boolean}
   */
  async getFundrisingCampaign(id) {
    try {
      const campaign = await FundrisingCampaign.findOne({
        _id: id,
        moderationVerified: true,
        completed: false,
      })
        .populate("user", "_id name email imgFileName")
        .select("-documentsForPayment -rejectedComment")
        .lean()
        .exec();
      if (campaign !== null) {
        return campaign;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
  /**
   * Send campaign for verification
   * @param {String} campaignId
   * @param {String} userId
   * @returns {Boolean}
   */
  async sendCampaignForVerification(campaignId, userId) {
    try {
      const campaign = await FundrisingCampaign.findOne({
        _id: campaignId,
        user: userId,
        completed: false,
        moderationVerified: false,
        rejectedComment: { $ne: "" },
      }).exec();
      if (campaign !== null) {
        campaign.rejectedComment = "";
        await campaign.save();
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
  /**
   * Get fundrising campaign by user id
   * @param {String} campaignId
   * @param {String} userId
   * @returns {Object|Boolean}
   */
  async getFundrisingCampaignByUser(campaignId, userId) {
    try {
      const campaign = await FundrisingCampaign.findOne({
        _id: campaignId,
        user: userId,
      })
        .lean()
        .exec();
      if (campaign !== null) {
        return campaign;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
  async checkDocument(campaignId, userId, documentFileName) {
    try {
      const campaign = await FundrisingCampaign.findOne({
        _id: campaignId,
        user: userId,
        documentsForPayment: documentFileName,
      }).exec();
      if (campaign !== null) {
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
  /**
   * Edit fundrising campaign
   * @param {String} userId
   * @param {String} campaignId
   * @param {String} prop
   * @param {Object} value
   * @returns {Object|Boolean}
   */
  async editFunrisingCampaign(userId, campaignId, prop, value) {
    try {
      const campaign = await FundrisingCampaign.findOne({
        _id: campaignId,
        user: userId,
        completed: false,
        moderationVerified: false,
        rejectedComment: { $ne: "" },
      }).exec();
      const oldCampaign = campaign.toObject();
      if (campaign !== null) {
        campaign[prop] = value;
        await campaign.save();
        return oldCampaign;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
}
module.exports = FundrisingCampaignRepository;
