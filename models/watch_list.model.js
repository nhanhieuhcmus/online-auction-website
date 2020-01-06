const db = require('../utils/db');

module.exports = {
    all: _ => db.load('select * from add_watch_list'),
    add: (user_id, product_id) => db.load(`insert add_watch_list (user_id, product_id) values (${user_id}, ${product_id})`),
    del: entity => db.load(`delete from add_watch_list where user_id=\"${entity.user_id}\" and product_id=${entity.product_id}`),
    single: (u_id, p_id) => db.load(`select * from add_watch_list where user_id = ${u_id} and product_id = ${p_id}`),
    isFavorite: async(Username, ProductID) => {
        ret = await db.load(`select * from add_watch_list where user_id=\"${Username}\" and product_id =${ProductID}`);
        return ret.length != 0
    },
    isHoldPrice: async(Username, ProductID) => {
        ret = await db.load(`select * from product where product.priceholder = ${Username} and product.id =${ProductID}`)
        return ret.length == 1
    },
    patch: entity => {
        const condition = { id: entity.id };
        delete entity.id;
        return db.patch('add_watch_list', entity, condition);
    },
    favoriteOfCurrentUser: user_id => db.load(`select * from add_watch_list where user_id = ${user_id}`),
};