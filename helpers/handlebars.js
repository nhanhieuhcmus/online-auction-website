const numeral = require('numeral');
<<<<<<< HEAD
const moment=require('moment')
const hbs_sections = require('express-handlebars-sections');
=======
const moment = require('moment');
const hbs_sections = require('express-handlebars-sections');
const session = require('express-session');
>>>>>>> be32f09961f3ed98ea98a6b2631a03de982897e7

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
<<<<<<< HEAD
            section: hbs_sections(), 
=======
            section: hbs_sections(),
            // More helpers...
>>>>>>> be32f09961f3ed98ea98a6b2631a03de982897e7
        }
    })

}
module.exports = hbsHelpers;