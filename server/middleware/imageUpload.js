const multer = require("multer");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");

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

module.exports = { upload };
