const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    key: { type: String, required: true }, // mongoose will make the primary key ("_id") automatically
    originalFileName: { type: String, required: true },
  },
  { timestamps: true } // It adds the time not only when it's created, but also when it's modified.
);

// Defining because it needs to make this file as a model. and add the Schema as a second parameter.
module.exports = mongoose.model("image", ImageSchema);
