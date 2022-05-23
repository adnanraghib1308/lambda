const {getPDFBuffer} = require('./helpers/billGeneration/billGeneration');
const {uploadFileWithBuffer} = require('./helpers/utils');
const dummyData = require('./db.json');

const handlerFunction = async (event) => {

  let pdf = null;
  const { type, data, bucket, fileName, rootFolderName } = event.body;

  switch(type) {
    case "billGeneration": {
      pdf = await getPDFBuffer(data);
      break;
    }
  }
  console.log(">>>>>>>>pdf ", pdf);

  const location = await uploadFileWithBuffer(pdf, bucket, fileName, rootFolderName);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      location
    }),
  }
  return response;
}

// handlerFunction({
//   type: 'billGeneration',
//   bucket: 'biobazaar',
//   fileName: 'pdf2',
//   rootFolderName: 'bills',
//   data: dummyData
// })

exports.handler = handlerFunction;
