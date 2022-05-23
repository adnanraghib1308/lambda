const fs = require("fs");
const path = require("path");
const chromium = require('chrome-aws-lambda')
const handlebars = require("handlebars");

handlebars.registerHelper('range', require('handlebars-helper-range'));

handlebars.registerHelper('serialNo', function (index, options) {
  var currentSerialNo = options.data.root['serialNo'];
  if (currentSerialNo === undefined) {
    currentSerialNo = index;
  } else {
    currentSerialNo++;
  }

  options.data.root['serialNo'] = currentSerialNo;
  return currentSerialNo;
});

handlebars.registerHelper("inc", function (value) {
  return parseInt(value) + 1;
});

handlebars.registerHelper("mod", function (value, mod, options) {
  var fnTrue = options.fn, fnFalse = options.inverse;
  return (value > 0 && (value % mod) === 0) ? fnTrue(this) : fnFalse(this);
});

const total = (obj, prop) => {
  let sum = 0;
  for (let i = 0; i < obj.length; i++) {
    sum += obj[i][prop];
  }
  return sum;
}

const getPDFBuffer = async (data) => {
  let browser = null;
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    var headerHtml = fs.readFileSync(path.join(process.cwd(), './templates/billGeneration/header.html'), 'utf8');
    var templateHtml = fs.readFileSync(path.join(process.cwd(), './templates/billGeneration/billGeneration.html'), 'utf8');
    var options = {
      format: 'a4',
      landscape: true,
      headerTemplate: '',
      footerTemplate: '',
      displayHeaderFooter: false,
      margin: {
        top: "30px",
        bottom: "30px",
      },
      printBackground: true,
      scale: 0.62
    }

    //page related
    const pageCount = Math.ceil(data.items.length / 18);

    //All the totals
    data.totalAmt = total(data.items, "mrp");

    // PDF Process
    var bodyTemplate = handlebars.compile(templateHtml);
    var headerTemplate = handlebars.compile(headerHtml);

    //todo: add for loop here for all pages
    const finalHeaderHtml = encodeURIComponent(headerTemplate(data));
    let finalBodyHtml = "";
    for (let i = 1; i <= pageCount; i++) {
      let flag = i == pageCount ? true : false;
      let index = (i - 1)*18 + 1;
      finalBodyHtml += finalHeaderHtml;
      finalBodyHtml += encodeURIComponent(bodyTemplate({
        "index": index,
        "items": data.items.slice((i - 1) * 18, i * 18),
        "pageNo": i,
        "pageCount": pageCount,
        "isLastPage": flag
      }));
    }
    // console.log();

    let finalHtml = finalBodyHtml;

    await page.goto(`data:text/html;charset=UTF-8,${finalHtml}`, {
      waitUntil: 'networkidle0'
    });
    await page.addStyleTag({ url: "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" });
    return await page.pdf(options);
  } catch (error) {
    return error;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}

module.exports = { getPDFBuffer }