const db = require('../utils/db');

module.exports = {
    add: entity => db.add('banned', entity),
    //allByProductId: id => db.load(`select offer.*, user.full_name from offer left join user on user.id=user_id  where product_id=${id} order by price desc`),
    single: (userId, productId) => db.load(`select * from banned where product_id = ${productId} and 
                                                                            user_id = ${userId}`),
};