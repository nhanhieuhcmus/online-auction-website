const categoryModel = require('../models/category.model');

module.exports = function (app) {
  app.use(async (req, res, next) => {
    const rows = await categoryModel.all();
    res.locals.lcCategory = rows;
<<<<<<< HEAD

    //xử lí sau đăng nhập
    if (!req.session.isAuthenticated) 
    {
      req.session.isAuthenticated=false;
    }
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.authUser = req.session.authUser;
    next();
=======
     next();
>>>>>>> be32f09961f3ed98ea98a6b2631a03de982897e7
  })
};