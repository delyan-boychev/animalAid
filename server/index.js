const express = require('express');
const authenticateJWT = require('./authenticateJWT');
const app = express();
const port = 4000;
const userRoute = require("./routes/user");
app.use(express.json());
app.use("/user", userRoute);
app.listen(port, () => {
  console.log(`Animal Aid server is running!`);
});