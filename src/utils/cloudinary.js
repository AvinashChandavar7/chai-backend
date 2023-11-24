import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    //* Upload the File on Cloudinary
    const response = await cloudinary.uploader.upload(
      localFilePath,
      { resource_type: 'auto' },
    );

    //* File has been successfully uploaded
    // console.log("file is uploaded on Cloudinary ", response);
    // console.log("file is uploaded on Cloudinary ", response.url);

    fs.unlinkSync(localFilePath);

    return response;

  } catch (error) {

    fs.unlinkSync(localFilePath);

    return null;
  }
}

export { uploadOnCloudinary };

/**
 *! This line of code
 ** fs.unlinkSync(localFilePath);
 *? Removes the locally saved in temporary file 
 *? as the upload operation got failed.
 **/
