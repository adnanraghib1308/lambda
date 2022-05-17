const {generatePdf} = require('./pdf');

exports.handler = async (event) => {
  generatePdf();
  console.log("hey hey hey inside lambda", event);
  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda and Github!"),
  }
  return response
}
