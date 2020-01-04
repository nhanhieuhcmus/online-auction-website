module.exports = function (app) {
    app.use('/category', require('../routes/product.route'));
    app.use('/admin/category', require('../routes/admin/category.route'));
<<<<<<< HEAD
    app.use('/account',require('../routes/account.route'));
=======
    // app.use('/register',require('../routes/account.route'));
    // app.use('/login',require('../routes/account.route'));

>>>>>>> be32f09961f3ed98ea98a6b2631a03de982897e7
};