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
  countForSearch: async key => {
    const rows = await db.load(`select count(*) as total
    from product left join category on product.categoryid=category.id
    where match(product.name) against(\"${key}\") OR match(category.name_category) against(\"${key}\")`)
    return rows[0].total;
  },

  sortSearchResult: async (key, offset, condition, column, type) => await db.load(`select result.*, user.full_name
    from (select product.*,name_category
    from product left join category on product.categoryid=category.id
    where ${condition} and match(product.name) against(\"${key}\") OR match(category.name_category) against(\"${key}\")) as result LEFT JOIN user on result.priceholder = user.id 
    order by ${column} ${type}
    limit ${config.paginate.limit} offset ${offset}`)
};