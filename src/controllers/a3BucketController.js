"use strict";

const catchAsync = require("../middleware/catchAsync");
const {
  uploadToS3,
  getUserPresignedUrls,
  deleteFile,
} = require("../models/A3Bucket");
const handleResponse = require("../utils/handleResponse");

/*/////////////////////////////// */
// Route to handle image upload
/*/////////////////////////////// */
const postImage = catchAsync(async (req, res, next) => {
  const { file } = req;
  const userId = req.headers["x-user-id"];

  // Validate request
  if (!file || !userId) {
    handleResponse(res, 400, "Bad request");
  }

  // Await the result of uploadToS3
  const { key, err } = await uploadToS3(file, userId);

  if (err) {
    return next(new AppError("Error uploading to S3", 500));
  }

  // Return success response
  const data = {
    fileName: file.originalname,
    key: key,
  };

  handleResponse(res, 200, "Upload successful", data);
});

/*/////////////////////////////// */
// Get images
/*/////////////////////////////// */
const getImages = catchAsync(async (req, res, next) => {
  const userId = req.headers["x-user-id"];

  // Validate request
  if (!userId) {
    handleResponse(res, 400, "Bad request: Missing user ID");
  }

  // Call getUserPresignedUrls with the userId
  const { presignedUrls, err } = await getUserPresignedUrls(userId);

  if (err) {
    return next(new AppError("Error fetching presigned URLs", 500));
  }

  const urls = {
    urls: presignedUrls,
  };

  handleResponse(res, 200, "Urls fetched successfully", urls);
});

/*//////////////////////////////////////////// */
// Update Image
/*//////////////////////////////////////////// */
const updateImage = catchAsync(async (req, res, next) => {
  const { userId, key } = req.body;
  const { file } = req; // New file data

  // Validate inputs
  if (!userId || !key || !file) {
    handleResponse(res, 400, "Bad request: Missing required parameters");
  }

  // Step 1: Delete the old file
  const deleteResponse = await deleteFile(userId, key);
  if (deleteResponse.err) {
    console.error("Error deleting file:", deleteResponse.err);
    return res.status(500).json({ message: "Failed to delete the old image" });
  }

  // Step 2: Upload the new file
  const { key: newKey, err } = await uploadToS3(file, userId);
  if (err) {
    console.error("Error uploading new file:", err);
    return next(new AppError("Failed to upload new image", 500));
  }

  // Step 3: Respond with success

  const updatedImage = { newKey: newKey };

  handleResponse(res, 200, "Image updated successfully", updatedImage);
});

/*//////////////////////////////////////////// */
// Delete Image
/*//////////////////////////////////////////// */
const deleteImage = catchAsync(async (req, res, next) => {
  const { userId, key } = req.params;

  // Validate inputs
  if (!userId || !key) {
    handleResponse(res, 400, "Missing key");
  }

  const { message, err } = await deleteFile(userId, key);

  if (err) {
    return next(new AppError("Failed to delete image", 500));
  }

  handleResponse(res, 200, { message: message });
});

module.exports = {
  postImage,
  getImages,
  updateImage,
  deleteImage,
};
