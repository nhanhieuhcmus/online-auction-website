const db = require('../utils/db');

module.exports = {
  all: () => db.load('select * from user'),
  single: id => db.load(`select * from user where id = ${id}`),
  add: entity => db.add('user', entity),
  del: id => db.del('user', { f_ID: id }),
  maxId: async () => {
    const res = await db.load('select max(id) as MaxID from user'); return res[0].MaxID;},
};