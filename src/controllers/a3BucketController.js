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
const {
  getProductByIdService,
  updateProductService,
} = require("../services/productService");

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
  const ImageId = iDparts[iDparts.length - 1];
  const filteredBody = filterObj({ avatar: presignedUrlsNew[0].url }, "avatar");
  if (Id.includes("userAvatar")) {
    await updateUserService(ImageId, { avatar: filteredBody.avatar });
  } else {
    const product = await getProductByIdService(ImageId);

    await updateProductService(product, { avatar: filteredBody.avatar });
  }

  handleResponse(res, 200, "Image updated successfully", updatedImage);
});

module.exports = {
  updateImage,
};
