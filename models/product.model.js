const db = require('../utils/db');
const config = require('../config/default.json');

module.exports = {
  all: () => db.load('select * from product'),
  countByCat: async catName => {
    const rows = await db.load(`select count(*) as total from product,category where product.categoryid = category.id and category.name_category=\"${catName}\"`)
    return rows[0].total;
  },
  pageByCat: (catName, offset) => db.load(`select product.*, user.full_name from product,category,user where product.categoryid = category.id and category.name_category=\"${catName}\" and product.priceholder = user.id limit ${config.paginate.limit} offset ${offset}`),
  allByCat: catName => db.load(`select product.*, user.full_name from product,category,user where name_category=\"${catName}\" and category.id = product.categoryid 
    and user.id = product.priceholder`),
  single: id => db.load(`select * from product where id = ${id}`),
  add: entity => db.add('product', entity),
  del: id => db.del('product', { product_id: id }),
  patch: entity => {
    const condition = { id: entity.id };
    delete entity.product_id;
    return db.patch('product', entity, condition);
  },
  maxId: async () => {
    const res = await db.load('select max(id) as MaxID from product');
    return res[0].MaxID;
  },
};