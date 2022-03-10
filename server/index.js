const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cron = require("node-cron");
const config = require("./config.json");
const mongoose = require("mongoose");
const bodyParse = require("./parseJson/body-parse");
const cronJobs = require("./cronJobs");
const compression = require("compression");
const app = express();
const fs = require("fs");
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
    origin: [config.BASE_URL, config.API_URL],
  },
});
const onConnection = require("./chatSockets")(io);
io.on("connection", onConnection);
app.disable("x-powered-by");
app.use(compression());
app.use(bodyParse);
app.use(cors({ origin: [config.API_URL, config.BASE_URL] }));
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
      defaultSrc: [
        "'self'",
        "'unsafe-inline'",
        config.BASE_URL,
        config.API_URL,
      ],
      scriptSrc: ["'self'", config.BASE_URL, config.BASE_URL, config.API_URL],
      objectSrc: ["'none'"],
      "style-src": null,
      upgradeInsecureRequests: [],
    },
  })
);
app.use(helmet.crossOriginEmbedderPolicy());
app.use(helmet.crossOriginOpenerPolicy());
app.use(helmet.crossOriginResourcePolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
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
