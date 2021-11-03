const express = require("express");
const config = require("./config.json");
const mongoose = require("mongoose");
const app = express();
var cors = require("cors");
const httpServer = require("http").Server(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: ["http://192.168.1.102:3000", "http://localhost:3000"],
  },
});
const onConnection = require("./chatSockets")(io);
io.on("connection", onConnection);
const port = 4000;
const userRoute = require("./routes/user");
const captchaRoute = require("./routes/captcha");
app.use(express.json());
app.use(cors());
app.post("/newMessage", (req, res) => {
  io.to("testroom").emit("newMessage", req.body.mes);
  res.sendStatus(200);
});
app.use("/user", userRoute);
app.use("/captcha", captchaRoute);
mongoose.connect(config.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
httpServer.listen(port, () => {
  console.log(`Animal Aid server is running!`);
});
