const cron = require("node-cron");
const FundrisingCampaign = require("./models/fundrisingCampaign");
const cronJobs = () => {
  cron.schedule("*/1 * * * *", () => {
    FundrisingCampaign.updateMany(
      {
        expireAt: { $gte: parseInt(new Date().getTime() / 1000) },
      },
      { $set: { completed: true } }
    );
  });
};
module.exports = cronJobs;
