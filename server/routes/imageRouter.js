const { Router } = require("express");
const imageRouter = Router();
const Image = require("../models/Image");
const { upload } = require("../middleware/imageUpload");

imageRouter.post("/", upload.single("image"), async (req, res) => {
  // 유저 정보 확인, public 유무 확인
  if (!req.user) throw new Error("권한이 없습니다.");
  try {
    const image = await new Image({
      user: {
        _id: req.user.id,
        name: req.user.name,
        username: req.user.username,
      },
      public: req.body.public,
      key: req.file.filename,
      originalFileName: req.file.originalname,
    }).save();
    res.json(image);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
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
