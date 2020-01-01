const categoryModel = require('../models/category.model');

module.exports = function (app) {
  app.use(async (req, res, next) => {
    const rows = await categoryModel.all();
    //console.log(rows);
    res.locals.lcCategory = rows;
    next();
  })
};