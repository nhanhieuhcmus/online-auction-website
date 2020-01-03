const db = require('../utils/db');

module.exports = {
    add: entity => db.add('offer', entity),
    allByProductId: id=>db.load(`select offer.*, user.full_name from offer left join user on user.id=user_id  where product_id=${id} order by time desc`),
    currentOffer: id=>db.load(`select * from waiting_offer where product=${id}`),
    patchOffer: entity =>{
        const condition={product:entity.product}
        delete entity.product
        return db.patch('waiting_offer',entity,condition)
    },
    addWaitingOffer: entity=>db.add('waiting_offer',entity)
};