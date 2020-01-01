const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from product'),
    allByCat: catName => db.load(`select product.*, user.full_name from product,category,user where name_category=\"${catName}\" and category.id = product.categoryid 
    and user.id = product.priceholder`),
    //catName: async catName => {const ret=await db.load(`select name_category from category where id = ${catId}`); return ret[0].name_category;}
    single: id => db.load(`select * from product where id = ${id}`),
    add: entity => db.add('product', entity),
    del: id => db.del('product', { product_id: id }),
    patch: entity => {
      const condition = { id: entity.id };
      delete entity.product_id;
      return db.patch('product', entity, condition);
    }
};