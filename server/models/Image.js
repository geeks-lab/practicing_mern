const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    user: {
      _id: { type: mongoose.Types.ObjectId, required: true, index: true },
      name: { type: String, required: true },
      username: { type: String, required: true },
    },
    likes: [{ type: mongoose.Types.ObjectId }],
    public: { type: Boolean, required: true, default: false },
    key: { type: String, required: true }, // mongoose will make the primary key ("_id") automatically
    originalFileName: { type: String, required: true },
    texts: { type: String },
  },
  { timestamps: true } // It adds the time not only when it's created, but also when it's modified.
);

// Defining because it needs to make this file as a model. and add the Schema as a second parameter.
module.exports = mongoose.model("image", ImageSchema);
