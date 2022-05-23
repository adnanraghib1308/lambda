exports.handler = async (event) => {
  console.log("hey hey hey inside lambda updated", event);
  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda and Github!"),
  }
  return response
}
