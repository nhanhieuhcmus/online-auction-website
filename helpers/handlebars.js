const numeral = require('numeral');

function hbsHelpers(hbs) {
    return hbs.create({
        defaultLayout: 'main.hbs',
        layoutsDir: 'views/_layouts',
        helpers: {
            format: val => numeral(val).format('0,0')
        }
         // More helpers...
    })
   
}
module.exports = hbsHelpers;