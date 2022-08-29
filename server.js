require("dotenv").config({ path: "./config.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const noteRouter = require("./routes/noteRoutes");
const app = express();

mongoose.connect(process.env.MONGODB_DATABASE).then(() => {
  console.log("DB connection successful");
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);
app.use("/notes", noteRouter);
app.get("/", (req, res) => {
  res.send("API is live");
});
app.listen(process.env.PORT, () => {
  console.log(`server is running`);
});
