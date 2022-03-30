const FundraisingCampaign = require("./models/fundraisingCampaign");
const fs = require("fs");
const path = require("path");
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
  cron.schedule("0 0 2 * * *", async () => {
    const dirImgChats = `${path.dirname(require.main.filename)}/imgChats`;
    let files = [];
    let date = new Date();
    fs.readdirSync(dirImgChats).forEach((file) => {
      let stats = fs.statSync(`${dirImgChats}/${file}`);
      let date = stats.mtime;
      date.setDate(date.getDate() + 14);
      files.push({ date, file });
    });
    files.forEach((file) => {
      if (date > file.date) {
        fs.unlinkSync(`${dirImgChats}/${file.file}`);
      }
    });
  });
};
module.exports = cronJobs;
