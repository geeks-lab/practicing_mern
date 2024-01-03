const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    session: [
      {
        createdAt: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);
0;
