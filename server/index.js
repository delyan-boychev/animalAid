const express = require("express");
const app = express();
var cors = require("cors");
const httpServer = require("http").Server(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const onConnection = require("./chatSockets")(io);
io.on("connection", onConnection);
const port = 4000;
const userRoute = require("./routes/user");
const diplomasRoute = require("./routes/diplomas");
app.use(express.json());
app.use(cors());
app.post("/newMessage", (req, res) => {
  io.to("testroom").emit("newMessage", req.body.mes);
  res.sendStatus(200);
});
app.use("/diplomas", diplomasRoute);
app.use("/user", userRoute);
httpServer.listen(port, () => {
  console.log(`Animal Aid server is running!`);
});
