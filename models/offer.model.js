const db = require('../utils/db');

module.exports = {
    add: entity => db.add('offer', entity),
    allByProductId: id=>db.load(`select offer.*, user.full_name from offer,user where product_id=${id} and user.id=user_id order by time desc`)
};