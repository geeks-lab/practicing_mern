const { Router } = require("express");
const imageRouter = Router();
const Image = require("../models/Image");
const { upload } = require("../middleware/imageUpload");
const fs = require("fs");
const { promisify } = require("util");
const mongoose = require("mongoose");

const fileUnlink = promisify(fs.unlink);

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

// public 이미지만 제공
imageRouter.get("/", async (req, res) => {
  const images = await Image.find({ public: true });
  res.json(images);
});

imageRouter.delete("/:imageId", async (req, res) => {
  // user 권한 확인
  // 사진 삭제(1. delete the pic in the "uploads" folder 2. delete the image in the DB)
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error(
        "올바르지 않은 이미지 id입니다.                                      "
      );
    //fs.unlink("./test.jpeg", (error) => {}); // call back 방식
    const image = await Image.findOneAndDelete({ _id: req.params.imageId }); // deleting from DB with the image._id
    if (!image)
      return res.json({ message: "요청하신 사진은 이미 삭제 되었습니다." });
    await fileUnlink(`./uploads/${image.key}`); // deleting from uploads folder(disk)
    res.json({ message: "요청하신 이미지가 삭제되었습니다.", image });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
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
