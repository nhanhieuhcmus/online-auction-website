const db = require('../utils/db');

module.exports = {
  all: () => db.load('select * from login'),
  single: id => db.load(`select * from login where id = ${id}`),
  singleByUsername: async username => {
    const rows = await db.load(`select * from login where user_name = '${username}'`);
    if (rows.length === 0)
      return null;

    return rows[0];
  },
  add: entity => db.add('login', entity),
  del: id => db.del('login', { f_ID: id }),
  maxId: async () => {
    const res = await db.load('select max(id) as MaxID from login'); return res[0].MaxID;},
};