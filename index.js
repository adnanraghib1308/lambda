import * as chromium from "chrome-aws-lambda";

const getPDFBuffer = async (html, options) => {
  let browser = null;
  try {
    const executablePath = await chromium.executablePath;
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      executablePath,
    });

    const page = await browser.newPage();
    const loaded = page.waitForNavigation({
      waitUntil: "load",
    });

    await page.setContent(html);
    await loaded;

    return await page.pdf(options);
  } catch (error) {
    return error;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
  </head>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

    .page-break {
      page-break-before: always;
    }
    .custom-font {
      font-family: Roboto, "Helvetica Neue", Arial, sans-serif;
    }
  </style>
  <body>
    <h1>Hello World</h1>
    <div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam consequatur
      voluptate, aut libero natus aliquid dignissimos! Voluptatem repellat
      quibusdam doloribus impedit quisquam labore molestias, saepe illum,
      assumenda eum voluptate praesentium.
    </div>
    <br /><br />
    <div>
      Hi, My Name is {{name}}, Welcome to PDF generation :)
    </div>
    <div class="page-break">
      This content is in another page thanks to the page-break-before css
      attribute.
    </div>
    <br /><br />
    <div class="custom-font">
      This content has a custom font loaded thanks to the google fonts CDN.
    </div>
    <br /><br />
    <img
      src="https://via.placeholder.com/500x500.png?text=Placeholder+Image"
      alt="Placeholder image"
    />
  </body>
</html>
`;

exports.handler = async (event) => {
  console.log("hey hey hey inside lambda updated", event);

  const options = {
    format: "A4",
    printBackground: true,
    margin: { top: "1in", right: "1in", bottom: "1in", left: "1in" },
  };
  const pdf = await getPDFBuffer(html, options);
  console.log(">>>>>>>>>>pdf ", pdf);
  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda and Github!"),
  }
  return response
}
