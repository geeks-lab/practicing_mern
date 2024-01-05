const { Router } = require("express");
const imageRouter = Router();
const Image = require("../models/Image");
const { upload } = require("../middleware/imageUpload");

imageRouter.post("/", upload.single("image"), async (req, res) => {
  // 유저 정보 확인, public 유무 확인
  const image = await new Image({
    key: req.file.filename,
    originalFileName: req.file.originalname,
  }).save();
  res.json(image);
});

imageRouter.get("/", async (req, res) => {
  // public 이미지만 제공
  const images = await Image.find();
  res.json(images);
});

imageRouter.delete("/:imageId", (req, res) => {
  // user 권한 확인
  // 사진 삭제
});

imageRouter.patch("/:imageId/like", (req, res) => {
  // user 권한 확인
  // like 중복 안되도록 확인
});

imageRouter.patch("/:imageId/unlike", (req, res) => {
  // user 권한 확인
  // like 중복 취소 안되도록 확인
});

module.exports = { imageRouter };
