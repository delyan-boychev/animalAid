const FundraisingCampaign = require("./models/fundraisingCampaign");
const cronJobs = (cron) => {
  cron.schedule("*/1 * * * *", async () => {
    await FundraisingCampaign.updateMany(
      {
        moderationVerified: true,
        completed: false,
        expireAt: { $lte: parseInt(new Date().getTime() / 1000) },
      },
      { $set: { completed: true } }
    );
  });
};
module.exports = cronJobs;
