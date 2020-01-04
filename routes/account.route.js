const express=require('express');
const router=express.Router();
const bodyparser=require('body-parser');
const bcrypt=require('bcryptjs');
const userModel = require('../models/user.model');
const loginModel = require('../models/login.model');
const moment = require('moment');
var dateFormat = require('dateformat');


router.get('/register', async (req, res) => {
    res.render('vwAccount/register');
});
router.post('/register', urlencodedParser, async (req, res) => {
    const N = 10;
    const hash = bcrypt.hashSync(req.body.password, N);
    var maxID = await userModel.maxId();
    var datejoined = new Date();
    dateFormat(datejoined, "%Y-%m-%d");
    // console.log(maxID);
    if (maxID == null)
        maxID = 0;
    // console.log(req.body.type_of_user);

    const entity_user = {
        id: +maxID + 1,
        full_name: req.body.fullname,
        email: req.body.email,
        address: req.body.address,
        date_of_birth: req.body.dob,
        date_joined: datejoined.toISOString(),
        type_of_user: +req.body.type_of_user,
        add_point: +0,
        minus_point: +0
    };

    const entity_login = {
        id: +maxID + 1,
        user_name: req.body.username,
        password: hash
    };


    const result = await userModel.add(entity_user);
    await loginModel.add(entity_login);
    const info = await userModel.single(entity_login.id);
    // res.render('home',
    //     {
    //         title: 'Trang chủ',
    //         user_name: info.user_name,
    //         new_product: info.type_of_user === 1 || info.type_of_user === 2,
    //         edit_categories: info.type_of_user === 1
    //     })
    res.send("Đăng ký thành công!");
})



router.get('/login', async (req, res) => {
    res.render('vwAccount/login');
});
// Check account matching
router.post('/login', async (req, res) => {
    const loginUser = await loginModel.singleByUsername(req.body.username);
    if (loginUser === null) {
        // return res.redirect('/account/login?err_message=2');
        return res.render('vwAccount/login', {
            layout: false,
            err_message: 'Tài khoản không tồn tại!'
        });
    }
    const rs = bcrypt.compareSync(req.body.password, loginUser.password);
    console.log(rs);
    if (rs === false) {
        // return res.redirect('/account/login?err_message=1');
        return res.render('vwAccount/login', {
            layout: false,
            err_message: 'Mật khẩu không chính xác!'
        });
    }

    req.session.isAuthenticated = true;
    console.log(req.session.isAuthenticated);
    req.session.authUser = loginUser;
    console.log(req.session.authUser);
    res.redirect('/');
})

router.post('/logout', (req, res) => {
    req.session.isAuthenticated = false;
    req.session.authUser = null;
    // res.redirect(req.headers.referer);
    res.redirect('/');
});


router.get('/profile', (req, res) => {
    res.render('vwAccount/profile');
});
module.exports = router;