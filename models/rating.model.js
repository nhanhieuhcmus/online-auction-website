const db = require('../utils/db');

module.exports = {
    add: entity => db.add('rating', entity),
    single: (sender, receiver, product) => db.load(`select * from rating where send_rating=${sender} and receive_rating=${receiver} and product_id=${product}`),
    del: (userId) => db.load(`DELETE FROM request_seller WHERE user_id = ${userId}`),
};