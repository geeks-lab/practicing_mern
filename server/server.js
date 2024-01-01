const express = require("express");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");
const mongoose = require("mongoose");

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
  .connect(
    "mongodb+srv://admin:irq6GQYpysCMKbtz@mongocluster.1bagdmk.mongodb.net/?retryWrites=true&w=majority",
    {
      useCreateIndex: true, // incase of using Index. If this is true, it creats an index for the ones that doesn't have.
    }
  )
  .then(() => {
    console.log("MongoDB Connected.");
    app.use("/uploads", express.static("uploads"));

    app.post("/upload", upload.single("image"), (req, res) =>
      res.json(req.file)
    );

    app.listen(PORT, () =>
      console.log("Express server listening on PORT " + PORT)
    );
  })
  .catch((err) => console.log(err));

// Changed the location from here to after then, because if the database is not connected, the server should not be started.
// app.use("/uploads", express.static("uploads"));

// app.post("/upload", upload.single("image"), (req, res) => res.json(req.file));

// app.listen(PORT, () => console.log("Express server listening on PORT " + PORT));
