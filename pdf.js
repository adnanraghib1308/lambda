const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
var pdff = require('html-pdf');
var AWS = require('aws-sdk');
// Set the region 

const SESConfig = {
  region: "us-east-1",
  "apiVersion": "2012-11-05",
  "accessKeyId": "AKIARZIOHHWYSTTVJUH4",
  "secretAccessKey": "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",
}

AWS.config.update(SESConfig);
const s3 = new AWS.S3();

exports.generatePdf = generatePdf = () => {
  try {
    (async () => {
        var dataBinding = {
            items: [{
                name: "item 1",
                price: 100
            },
            {
                name: "item 2",
                price: 200
            },
            {
                name: "item 3",
                price: 300
            }
            ],
            total: 600,
            isWatermark: true
        }

        var templateHtml = fs.readFileSync(path.join(process.cwd(), 'invoice.html'), 'utf8');
        var template = handlebars.compile(templateHtml)(dataBinding);

        var options = {
            format: 'Ledger',
            headerTemplate: "<p></p>",
            footerTemplate: "<p></p>",
            displayHeaderFooter: false,
            margin: {
                top: "40px",
                bottom: "100px"
            },
            printBackground: true,
            path: 'invoice.pdf'
        }

        // pdff.create(`${template}`, options).toFile('./businesscard.pdf', function(err, res) {
        //     if (err) return console.log(err);
        //     console.log(res); // { filename: '/app/businesscard.pdf' }
        // });
        pdff.create(template).toStream(function(err, stream){
          //stream.pipe(fs.createWriteStream('foo1.pdf'));
          const params = {
                        Key: 'foo3.pdf',
                        Body: stream,
                        Bucket: 'pdfdocsbill',
                        ContentType: 'application/pdf',
                    };
          s3.upload(params, (err, res) => {
                        if (err) {
                            console.log(err, 'err');
                        }
                        console.log(res, 'res');
                    });
        });
    })();
  } catch (err) {
      console.log('ERROR:', err);
  }
}

