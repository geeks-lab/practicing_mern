require("dotenv").config();
const express = require("express");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");
const mongoose = require("mongoose");

const Image = require("./models/Image"); // Calling the Imgage model
// the other way to do it like the above is `const Images = mongoose.model("image")`
// Using the upper one is better in terms of using typescripts(needs the type interface) in the future.

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) =>
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png"].includes(file.mimetype)) cb(null, true);
    else cb(new Error("invalid file type."), false);
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

const app = express();
const PORT = 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected.");
    app.use("/uploads", express.static("uploads"));
    app.post("/upload", upload.single("image"), async (req, res) => {
      // Making the new Instance about the model
      await new Image({
        key: req.file.filename,
        originalFileName: req.file.originalname,
      }).save();
      res.json(req.file);
    });

    app.listen(PORT, () =>
      console.log("Express server listening on PORT " + PORT)
    );
  })
  .catch((err) => console.log(err));

// Changed the location from here to after then, because if the database is not connected, the server should not be started.
// app.use("/uploads", express.static("uploads"));

// app.post("/upload", upload.single("image"), (req, res) => res.json(req.file));

// app.listen(PORT, () => console.log("Express server listening on PORT " + PORT));
