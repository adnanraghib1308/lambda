const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
var pdff = require('html-pdf');

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

        pdff.create(template, options).toFile('./businesscard.pdf', function(err, res) {
            if (err) return console.log(err);
            console.log(res); // { filename: '/app/businesscard.pdf' }
        });
    })();
  } catch (err) {
      console.log('ERROR:', err);
  }
}

