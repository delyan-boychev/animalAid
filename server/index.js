const express = require("express");
const cron = require("node-cron");
const config = require("./config.json");
const mongoose = require("mongoose");
const bodyParse = require("./parseJson/body-parse");
const cronJobs = require("./cronJobs");
const compression = require("compression");
const app = express();
const fs = require("fs");
var cors = require("cors");
const privateKey = fs.readFileSync("./ssl/key.pem", "utf8");
const certificate = fs.readFileSync("./ssl/cert.pem", "utf8");
const updateCaptchaEncryption =
  require("./encryption/captchaEncryption").updateCaptchaEncryption;
const port = config.PORT;
const userRoute = require("./routes/user");
const captchaRoute = require("./routes/captcha");
const adminRoute = require("./routes/admin");
const cityRoute = require("./routes/city");
const threadRoute = require("./routes/thread");
const fundrisingCampaignRoute = require("./routes/fundrisingCampaign");
const vetRoute = require("./routes/vet");
const credentials = {
  key: privateKey,
  cert: certificate,
  passphrase: config.SSL_CERTIFICATE_PASS,
};
const httpServer = require("https").createServer(credentials, app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: [config.BASE_URL],
  },
});
const onConnection = require("./chatSockets")(io);
io.on("connection", onConnection);
app.disable("x-powered-by");
app.use(compression());
app.use(bodyParse);
app.use(cors());
app.use("/user", userRoute);
app.use("/captcha", captchaRoute);
app.use("/admin", adminRoute);
app.use("/city", cityRoute);
app.use("/thread", threadRoute);
app.use("/fundrisingCampaign", fundrisingCampaignRoute);
app.use("/vet", vetRoute);
mongoose.connect(config.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
cronJobs(cron);
updateCaptchaEncryption();
setInterval(updateCaptchaEncryption, 600000);
httpServer.listen(port, () => {
  console.log(`Animal Aid server is running!`);
});
