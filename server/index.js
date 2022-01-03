const express = require("express");
const config = require("./config.json");
const mongoose = require("mongoose");
const app = express();
var cors = require("cors");
const updateCaptchaEncryption = require("./captcha/updateCaptchaEncryption");
const port = 4000;
const userRoute = require("./routes/user");
const captchaRoute = require("./routes/captcha");
const adminRoute = require("./routes/admin");
const httpServer = require("http").Server(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: ["http://192.168.1.102:3000", "http://localhost:3000"],
  },
});
const onConnection = require("./chatSockets")(io);
io.on("connection", onConnection);
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
