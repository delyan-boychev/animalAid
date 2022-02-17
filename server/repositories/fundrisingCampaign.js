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
      .select("title shortDescription mainPhoto value")
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
      const campaign = await FundrisingCampaign.findById(id).exec();
      if (campaign !== null) {
        return campaign;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
}
module.exports = FundrisingCampaignRepository;
