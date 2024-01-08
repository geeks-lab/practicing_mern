const { Router } = require("express");
const imageRouter = Router();
const Image = require("../models/Image");
const { upload } = require("../middleware/imageUpload");
const fs = require("fs");
const { promisify } = require("util");
const mongoose = require("mongoose");

const fileUnlink = promisify(fs.unlink);

imageRouter.post("/", upload.array("image", 30), async (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    const images = await Promise.all(
      req.files.map(async (file) => {
        const image = await new Image({
          user: {
            _id: req.user.id,
            name: req.user.name,
            username: req.user.username,
          },
          public: req.body.public,
          key: file.filename,
          originalFileName: file.originalname,
        }).save();
        return image;
      })
    );
    res.json(images);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

imageRouter.get("/", async (req, res) => {
  try {
    const { lastid } = req.query;
    if (lastid && !mongoose.isValidObjectId(lastid)) {
      throw new Error("invalid lastid");
    }
    const images = await Image.find(
      lastid
        ? {
            public: true,
            _id: { $lt: lastid },
          }
        : { public: true } // 첫페이지라 lastid가 없을 경우 예외처리
    )
      .sort({ _id: -1 })
      .limit(20);
    res.json(images);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
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

imageRouter.patch("/:imageId/like", async (req, res) => {
  // user 권한 확인
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("올바르지 않은 이미지ID입니다.");
    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      { $addToSet: { likes: req.user.id } },
      { new: true }
    );
    res.json(image);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

imageRouter.patch("/:imageId/unlike", async (req, res) => {
  // like 중복 취소 안되도록 확인
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("올바르지 않은 이미지ID입니다.");
    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      { $pull: { likes: req.user.id } },
      { new: true }
    );
    res.json(image);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = { imageRouter };
