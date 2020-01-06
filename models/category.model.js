const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from category'),
    single: id => db.load(`select * from category where id = ${id}`),
    add: entity => db.add('category', entity),
    del: Catid => db.del('category', { id: Catid }),
    patch: entity => {
      const condition = { id: entity.id };
      delete entity.id;
      return db.patch('category', entity, condition);
    },
    maxId: async () => {
      const res = await db.load('select max(id) as MaxID from category'); 
      return res[0].MaxID;},
};