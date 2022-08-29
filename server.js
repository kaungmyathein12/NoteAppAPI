require("dotenv").config({ path: "./config.env" });
const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
const userRouter = require("./routes/userRoutes");
const noteRouter = require("./routes/noteRoutes");
const app = express();
app.use(cors());
mongoose
  .connect(process.env.MONGODB_DATABASE)
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((e) => {
    console.log(e);
  });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);
app.use("/notes", noteRouter);
app.get("/", (req, res) => {
  res.send("API is live");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running ${PORT}`);
});
