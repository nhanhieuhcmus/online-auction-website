const restrict = require('../middlewares/auth.mdw');

module.exports = function (app) {
    app.use('/account', require('../routes/account.route'));
    app.use('/category', require('../routes/product.route'));
    app.use('/admin/category', restrict, require('../routes/admin/category.route'));
    // app.use('/register',require('../routes/account.route'));
    // app.use('/login',require('../routes/account.route'));

};