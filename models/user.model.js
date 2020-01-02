const db = require('../utils/db');

module.exports = {
  all: () => db.load('select * from users'),
  single: id => db.load(`select * from users where f_ID = ${id}`),
  add: entity => db.add('login', entity),
  del: id => db.del('users', { f_ID: id }),
};