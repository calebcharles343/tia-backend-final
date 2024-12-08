"use strict";

const express = require("express");

const a3BucketRouter = express.Router();

// Apply multer middleware only for the POST route
const multer = require("multer");
const {
  postImage,
  deleteImage,
  getImages,
  updateImage,
} = require("../controllers/a3BucketController");
const { memoryStorage } = multer;
const storage = memoryStorage();
const upload = multer({ storage });

a3BucketRouter.post("/", upload.single("image"), postImage);
a3BucketRouter.get("/", getImages);
a3BucketRouter.put("/", upload.single("image"), updateImage);
a3BucketRouter.delete("/:userId/:key", deleteImage); // Adjust route to avoid duplication

module.exports = a3BucketRouter;
