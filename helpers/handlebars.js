const numeral = require('numeral');
const moment=require('moment')

function hbsHelpers(hbs) {
    return hbs.create({
        defaultLayout: 'main.hbs',
        layoutsDir: 'views/_layouts',
        helpers: {
            format: val => numeral(val).format('0,0'),
            TimeFormat: time => moment(time).format('DD/MM/YYYY hh:mm:ss'),
            hideName: name => {
                if (name != null) return '****' + name.substr(name.length - 4, 4)
                return ""
            },
        }
        // More helpers...
    })

}
module.exports = hbsHelpers;