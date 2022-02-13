const FundrisingCampaign = require("../models/fundrisingCampaign");
class FundrisingCampaignRepository {
  async createFundrisingCampaign(campaign) {
    const campaign = new FundrisingCampaign(campaign);
    try {
      await campaign.save();
      return true;
    } catch {
      return false;
    }
  }
  async completeFundrisingCampaign(campaignId, userId) {
    try {
      const campaign = await FundrisingCampaign.findOne({
        _id: campaignId,
        user: userId,
      }).exec();
      if (campaign !== null) {
        campaign.completed = true;
        campaign.save();
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
}
module.exports = FundrisingCampaignRepository;
