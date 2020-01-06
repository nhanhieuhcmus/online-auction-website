const db = require('../utils/db');

module.exports = {
  all: () => db.load('select * from user'),
  single: id => db.load(`select * from user where id = ${id}`),
  add: entity => db.add('user', entity),
  del: id => db.del('user', { f_ID: id }),
  maxId: async () => {
    const res = await db.load('select max(id) as MaxID from user'); 
    return res[0].MaxID;
  },
  checkEmail: email => db.load(`select * from user where email='${email}'`),
  checkPass: pass => db.load(`select * from login where password='${pass}'`),
  checkUser: username => db.load(`select * from login where user_name='${username}'`),
  changePass:(username,new_password) => db.load(`update login set password = '${new_password}' WHERE user_name = '${username}'`),
  patch: entity => {
    const condition = { id: entity.id };
    return db.patch('user', entity, condition);
  },
};