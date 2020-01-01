const db = require('../utils/db');

module.exports = {
    add: entity => db.addoffer('offer', entity),
    
};