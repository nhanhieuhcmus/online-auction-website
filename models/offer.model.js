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

    auctionList: userId => db.load(`select result.*, cat.name_category, u.full_name
    from (select p.*, o.user_id from product p LEFT JOIN offer o on p.id = o.product_id
    where p.end_date - NOW() > 0 and o.user_id = ${userId}) result, user u, category cat
    where result.priceholder = u.id and result.categoryid = cat.id`),
    
    wonList: userId => db.load(`select result.*, cat.name_category, u.full_name
    from (select p.*, wt.user from product p LEFT JOIN waiting_offer wt on p.id = wt.product
    where p.end_date - NOW() < 0 and wt.user = ${userId}) result, user u, category cat
    where result.priceholder = u.id and result.categoryid = cat.id`),

    purchaseList: userId => db.load(`select result.*, cat.name_category, u.full_name
    from (select p.*, wt.user from product p LEFT JOIN waiting_offer wt on p.id = wt.product
    where p.id_seller = ${userId} and p.end_date - NOW() < 0) result, user u, category cat
    where result.priceholder = u.id and result.categoryid = cat.id`)

};