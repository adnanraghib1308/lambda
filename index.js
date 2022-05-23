const {getPDFBuffer} = require('./helpers/billGeneration');
const {uploadFileWithBuffer} = require('./helpers/utils');
const dummyData = require('./db.json');

const handlerFunction = async (event) => {

  let pdf = null;
  const { type, data, bucket, fileName, rootFolderName} = event;

  switch(type) {
    case "billGeneration": {
      pdf = await getPDFBuffer(data);
      break;
    }
  }

  const location = await uploadFileWithBuffer(pdf, bucket, fileName, rootFolderName);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      location
    }),
  }
  return response;
}

exports.handler = handlerFunction;
