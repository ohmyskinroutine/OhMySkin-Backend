const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    routine: {
      morning: { type: [Object], default: [] },
      evening: { type: [Object], default: [] },
    },
    routineHistory: [
      {
        morning: [Object],
        evening: [Object],
        createdAt: { type: Date, default: Date.now },
      },
    ],
    favorites: {
      type: [
        {
          code: String,
          product_name: String,
          image: String,
          brands: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
