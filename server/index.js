const express = require("express");
const config = require("./config.json");
const mongoose = require("mongoose");
const app = express();
const fs = require("fs");
var cors = require("cors");
const privateKey = fs.readFileSync("./ssl/key.pem", "utf8");
const certificate = fs.readFileSync("./ssl/cert.pem", "utf8");
const updateCaptchaEncryption = require("./captcha/updateCaptchaEncryption");
const port = 8443;
const userRoute = require("./routes/user");
const captchaRoute = require("./routes/captcha");
const adminRoute = require("./routes/admin");
const credentials = {
  key: privateKey,
  cert: certificate,
  passphrase: "delyan050710!@#$%^&*()",
};
const httpServer = require("https").createServer(credentials, app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: [
      "http://animalaidbg.com:8080",
      "https://animalaidbg.com",
      "http://animalaidbg.com",
    ],
  },
});
const onConnection = require("./chatSockets")(io);
io.on("connection", onConnection);
app.disable("x-powered-by");
app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use("/user", userRoute);
app.use("/captcha", captchaRoute);
app.use("/admin", adminRoute);
mongoose.connect(config.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
updateCaptchaEncryption();
setInterval(updateCaptchaEncryption, 600000);
httpServer.listen(port, () => {
  console.log(`Animal Aid server is running!`);
});
