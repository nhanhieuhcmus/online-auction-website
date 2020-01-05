const db = require('../utils/db');

module.exports = {
    add: entity => db.add('offer', entity),
    allByProductId: id => db.load(`select offer.*, user.full_name from offer left join user on user.id=user_id  where product_id=${id} order by price desc`),
    single: (userId, productId, price) => db.load(`select * from offer where product_id = ${productId} and 
                                                                            user_id = ${userId} and
                                                                            price = ${price}`),
    patch: entity => {
        const condition = { id: entity.id };
        delete entity.id;
        return db.patch('offer', entity, condition);
    },
    currentOffer: id => db.load(`select * from waiting_offer where product=${id}`),
    patchOffer: entity => {
        const condition = { product: entity.product }
        delete entity.product
        return db.patch('waiting_offer', entity, condition)
    },
    addWaitingOffer: entity => db.add('waiting_offer', entity),
    del: (userId, productId) => db.load(`DELETE FROM offer WHERE user_id = ${userId} AND product_id = ${productId}`),
    delWaiting: (userId, productId) => db.load(`DELETE FROM waiting_offer WHERE user = ${userId} AND product = ${productId}`),
};