const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Upload a file or buffer to ImageKit
 * @param {Buffer|string} file - Buffer (from multer) or base64 string
 * @param {string} fileName - Name of the file to store in ImageKit
 * @returns {Promise<Object>} - ImageKit upload response
 */
async function uploadFile(file, fileName) {
  try {
    let uploadFileData = file;

    // If it's a Buffer, convert to base64 string
    if (Buffer.isBuffer(file)) {
      uploadFileData = file.toString("base64");
    }

    // Upload to ImageKit
    const result = await imagekit.upload({
      file: uploadFileData,
      fileName: fileName,
    });

    console.log("ImageKit upload successful:", result.url);
    return result;
  } catch (error) {
    console.error("ImageKit upload failed:", error.message || error);
    throw new Error("Failed to upload file to ImageKit");
  }
}

module.exports = { uploadFile };
