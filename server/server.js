require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { imageRouter } = require("./routes/imageRouter");
const { userRouter } = require("./routes/userRouter");
const app = express();
const { MONGO_URI, PORT } = process.env;
const { authenticate } = require("./middleware/authentication");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected.");
    app.use("/uploads", express.static("uploads"));
    app.use(express.json());
    app.use(authenticate); // the order matters. This has to be after teh express.json.
    app.use("/images", imageRouter);
    app.use("/users", userRouter);
    app.listen(PORT, () =>
      console.log("Express server listening on PORT " + PORT)
    );
  })
  .catch((err) => console.log(err));
