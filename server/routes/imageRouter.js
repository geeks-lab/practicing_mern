const { Router } = require("express");
const imageRouter = Router();
const Image = require("../models/Image");
const { upload } = require("../middleware/imageUpload");

imageRouter.post("/", upload.single("image"), async (req, res) => {
  // Making the new Instance about the model
  const image = await new Image({
    key: req.file.filename,
    originalFileName: req.file.originalname,
  }).save();
  res.json(image);
});
// New API: Read and return all the information about the uploaded on the database.
imageRouter.get("/", async (req, res) => {
  const images = await Image.find();
  res.json(images);
});

module.exports = { imageRouter };
