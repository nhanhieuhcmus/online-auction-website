const categoryModel = require('../models/category.model');

module.exports = function (app) {
  app.use(async (req, res, next) => {
    const rows = await categoryModel.all();
    //console.log(rows);
    res.locals.lcCategory = rows;

    //xử lí sau đăng nhập
    if (!req.session.isAuthenticated) 
    {
      req.session.isAuthenticated=false;
    }
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.authUser = req.session.authUser;
    next();
  })
};