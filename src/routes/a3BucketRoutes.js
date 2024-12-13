"use strict";

const express = require("express");

const a3BucketRouter = express.Router();

// Apply multer middleware only for the POST route
const multer = require("multer");
const { updateImage } = require("../controllers/a3BucketController");
const { memoryStorage } = multer;
const storage = memoryStorage();
const upload = multer({ storage });

a3BucketRouter.put("/", upload.single("image"), updateImage);

module.exports = a3BucketRouter;
