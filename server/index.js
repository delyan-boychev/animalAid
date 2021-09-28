const express = require("express");
const app = express();
var cors = require("cors");
const port = 4000;
const userRoute = require("./routes/user");
const diplomasRoute = require("./routes/diplomas");
app.use(express.json());
app.use(cors());
app.use("/diplomas", diplomasRoute);
app.use("/user", userRoute);
app.listen(port, () => {
  console.log(`Animal Aid server is running!`);
});
