"use strict";

const catchAsync = require("../middleware/catchAsync");
const {
  uploadToS3,
  getUserPresignedUrls,
  deleteFile,
} = require("../models/A3Bucket");
const handleResponse = require("../utils/handleResponse");
const AppError = require("../utils/appError.js");
const filterObj = require("../utils/filterObj");
const { updateUserService } = require("../services/userServices");

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
  let Id;
  if (req.headers["x-user-id"]) Id = req.headers["x-user-id"];
  if (req.headers["x-product-id"]) Id = req.headers["x-product-id"];

  // const { file } = req;

  // Validate request
  if (!Id) {
    handleResponse(res, 400, "Bad request: Missing user ID");
  }

  // Call getUserPresignedUrls with the Id
  const { presignedUrls, err } = await getUserPresignedUrls(Id);

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
  let Id = req.headers["x-user-id"] || req.headers["x-product-id"];

  const { file } = req; // New file data

  // Validate inputs
  if (!Id || !file) {
    return handleResponse(res, 400, "Bad request: Missing required parameters");
  }

  // Step 1: Check for existing images
  const { presignedUrls, err: fetchError } = await getUserPresignedUrls(Id);

  if (fetchError) {
    console.error("Error fetching existing images:", fetchError);
    return next(new AppError("Error checking existing images", 500));
  }

  // Step 2: If an existing image is found, delete it
  if (presignedUrls.length > 0) {
    const existingImageKey = presignedUrls[0].key.split("/")[1]; // Extract the key
    const deleteResponse = await deleteFile(Id, existingImageKey);

    if (deleteResponse.err) {
      console.error("Error deleting existing image:", deleteResponse.err);
      return res
        .status(500)
        .json({ message: "Failed to delete existing image" });
    }
  }

  // Step 3: Upload the new image
  const { key: newKey, err: uploadError } = await uploadToS3(file, Id);

  if (uploadError) {
    console.error("Error uploading new image:", uploadError);
    return next(new AppError("Failed to upload new image", 500));
  }

  // Step 4: Respond with success
  const updatedImage = { newKey };
  const { presignedUrls: presignedUrlsNew, err } = await getUserPresignedUrls(
    Id
  );

  if (err) {
    const errorType = Id.includes("userAvatar")
      ? "Updating user"
      : "Updating Product";
    return next(new AppError(`Failed to get url for ${errorType}`, 500));
  }

  const iDparts = Id.split("-");
  const userId = iDparts[iDparts.length - 1];
  const filteredBody = filterObj({ avatar: presignedUrlsNew[0].url }, "avatar");
  await updateUserService(userId, { avatar: filteredBody.avatar });

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
