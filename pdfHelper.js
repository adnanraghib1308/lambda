const chromium = require('chrome-aws-lambda')

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

module.exports = {getPDFBuffer}