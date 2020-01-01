const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from category'),

     // single: id => db.load(`select * from product where ProID = ${id}`),
    // add: entity => db.add('product', entity),
    // del: id => db.del('product', { ProID: id }),
    // patch: entity => {
    //   const condition = { ProID: entity.ProID };
    //   delete entity.ProID;
    //   return db.patch('product', entity, condition);
    // }

    allWithDetails: _ => {
        const sql = `select c.id, c.name_category, count(p.id) as num_of_products
          from category c, product p where c.id = p.categoryid
          group by c.id`;
        return db.load(sql);
      },
};