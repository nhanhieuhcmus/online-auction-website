const categoryModel = require('../models/category.model');
const userModel = require('../models/user.model');

module.exports = function (app) {
  app.use(async (req, res, next) => {
    const rows = await categoryModel.all();
    res.locals.lcCategory = rows;
    //xử lí sau đăng nhập
    if (!req.session.isAuthenticated) {
      req.session.isAuthenticated = false;
    }
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.authUser = req.session.authUser;
    res.locals.userInfo = req.session.userInfo;

    if (req.session.authUser) {
      const user = await userModel.single(req.session.authUser.id);
     // console.log(user);
      if (user[0].type_of_user == 1)
        res.locals.isAdmin = true;
      else if (user[0].type_of_user == 2)
        res.locals.isBidder = true;
      else if (user[0].type_of_user == 3)
        res.locals.isSeller = true;
    }
    next();
  })
};