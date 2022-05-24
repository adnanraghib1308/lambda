const moment = require('moment');
const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

/**
 * returns s3 file path by adding year month day sub folders
 * @param rootFolderName
 * @param fileName
 */
 const getS3FilePath = (rootFolderName, fileName) => {
  const momentObj = moment();
  const year = momentObj.year();
  const month = momentObj.month();
  const day = momentObj.date();

  return `${rootFolderName}/${year}/${month}/${day}/${fileName}`;
};

/**
 * upload file to s3 using bucket
 */
const uploadFileWithBuffer = async (buffer, bucket, fileName, rootFolderName) => {

  const upload = await s3.upload({
    Body: buffer,
    Bucket: bucket,
    Key: `${getS3FilePath(rootFolderName, fileName)}`
  });
  const { Location } = await upload.promise();
  return Location;
};

module.exports = { uploadFileWithBuffer }