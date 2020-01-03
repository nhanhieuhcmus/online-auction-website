const db = require('../utils/db');

module.exports = {
  all: () => db.load('select * from user'),
  single: id => db.load(`select * from user where id = ${id}`),
  add: entity => db.add('login', entity),
  del: id => db.del('user', { f_ID: id }),
};