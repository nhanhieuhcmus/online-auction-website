module.exports = function (app) {
    app.use('/category', require('../routes/product.route'));
    app.use('/admin/category', require('../routes/admin/category.route'));
};