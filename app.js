const path = require("path");
const express = require("express");
const app = express();
const multer = require("multer");
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const PORT = process.env.PORT || 4000;
const mongoose = require("mongoose");
const feedRoutes = require("./routes/feed");
const bodyParser = require("body-parser");
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(bodyParser.json()); // application/json
app.use("/images", express.static(path.join(__dirname, "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});
app.use(feedRoutes);
if (process.env.NODE.ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://mateen:Y9j9wR30JZNevcdN@cluster0.crgnu.mongodb.net/feedposts?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(PORT);
  })
  .catch((error) => {
    console.log(error);
  });
