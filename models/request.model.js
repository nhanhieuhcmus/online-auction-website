const db = require('../utils/db');

module.exports = {
    add: entity => db.add('request_seller', entity),
    all: () => db.load(`select request_seller.*, user.full_name from request_seller left join user on user.id=user_id`),
    del: (userId) => db.load(`DELETE FROM request_seller WHERE user_id = ${userId}`),
};