const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const loginModel = require('../models/login.model');
const moment = require('moment');
var dateFormat = require('dateformat');
const request = require('request');
// const fetch = require('node-fetch');
// const { stringify } = require('querystring');
// const verifyUrl = 'https://google.com/recaptcha/api/siteverify?secret=${secretKey}&reponse=${req.body.captcha}&remoteip=${req.connection.remoteAddress}';

const isLogin = (req, res, next) => {
    if (req.session.isAuthenticated === true)
      return res.redirect('/');
  
    next();
  }

const restrict = require('../middlewares/auth.mdw');

router.get('/register', isLogin, async (req, res) => {
    res.render('vwAccount/register');
});

router.post('/register', isLogin, async (req, res) => {
    const N = 10;
    const hash = bcrypt.hashSync(req.body.password, N);

    var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var maxID = await userModel.maxId();
    var datejoined = new Date();
    dateFormat(datejoined, "%Y-%m-%d");
    if (maxID == null)
        maxID = 0;
    const check = await userModel.checkEmail(req.body.email);
    console.log(check);
    if (check != false && req.body.password != req.body.repassword) {
        res.render('vwAccount/register', { check_email: 'Email không được trùng!', check_pass: 'Mật khẩu nhập lại không khớp!' });
    }
    else {
        const entity_user = {
            id: +maxID + 1,
            full_name: req.body.fullname,
            email: req.body.email,
            address: req.body.address,
            date_of_birth: dob,
            date_joined: datejoined,
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
        //         edit_categories: info.type_of_user === 1F
        //     })
        res.redirect('/');
    }
})
router.post('/submit', isLogin, async (req, res) => {
    // if (!req.body.captcha)
    //     return res.json({ success: false, msg: 'Please select captcha' });
    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return res.json({ "responseCode": 1, "responseDesc": "Please select captcha" });
    }
    // Secret key
    const secretKey = '6LflcswUAAAAAG6-7_Iut82_HKUR3EjpUj3ecXoJ';

    // Verify URL
    // const query = stringify({
    //     secret: secretKey,
    //     response: req.body.captcha,
    //     remoteip: req.connection.remoteAddress
    // });
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
    //const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;
    // // Make a request to verifyURL
    // const body = await fetch(verifyURL).then(res => res.json());
    // // If not successful
    // if (body.success !== undefined && !body.success)
    //     return res.json({ success: false, msg: 'Failed captcha verification' });
    // // If successful
    // return res.json({ success: true, msg: 'Captcha passed' });

    // Hitting GET request to the URL, Google will respond with success or error scenario.
    request(verificationUrl, function (error, response, body) {
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if (body.success !== undefined && !body.success) {
            return res.json({ "responseCode": 1, "responseDesc": "Failed captcha verification" });
        }
        alert("submit OK");

        res.json({ "responseCode": 0, "responseDesc": "Success" });
    });

});

router.get('/login', isLogin, async (req, res) => {
    res.render('vwAccount/login');
});
// Check account matching
router.post('/login', isLogin, async (req, res) => {
    const loginUser = await loginModel.singleByUsername(req.body.username);
    if (loginUser === null) {
        // return res.redirect('/account/login?err_message=2');
        return res.render('vwAccount/login', {
            err_message: 'Tài khoản không tồn tại!'
        });
    }
    const rs = bcrypt.compareSync(req.body.password, loginUser.password);
    if (rs === false) {
        // return res.redirect('/account/login?err_message=1');
        return res.render('vwAccount/login', {
            err_message: 'Mật khẩu không chính xác!'
        });
    }

    req.session.isAuthenticated = true;
    req.session.authUser = loginUser;
    const userInfo = await userModel.singleByID(loginUser.id);
    var dob = moment(userInfo.date_of_birth, 'YYYY-MM-DD').format('DD-MM-YYYY');
    var datejoined = moment(userInfo.date_joined, 'YYYY-MM-DD').format('DD-MM-YYYY');

    userInfo.date_of_birth = dob;//convert db datetime into normal datetime before wrap it to session
    userInfo.date_joined = datejoined;//convert db datetime into normal datetime before wrap it to session

    req.session.userInfo = userInfo;

    const url = req.query.retUrl || '/';
    if (req.query.method == 'post')
        res.redirect(307, url);
    else
        res.redirect(url);
})

router.post('/logout', restrict, (req, res) => {
    req.session.isAuthenticated = false;
    req.session.authUser = null;
    // res.redirect(req.headers.referer);
    res.redirect('/');
});


router.get('/profile', restrict, (req, res) => {
    res.render('vwAccount/profile');
});
router.post('/change_password', async (req, res) => {
    const cur_pw = req.body.current_password;
    const new_pw = req.body.new_password;
    const re_new_pw=req.body.re_new_password;
    const check_usr = await userModel.checkUser(req.session.authUser.user_name);
    const check_pw = await userModel.checkPass(cur_pw);
    const rs = bcrypt.compareSync(cur_pw, req.session.authUser.password);
    //check current password is right
    if (!rs){
        res.send("Mật khẩu hiện tại sai!");
    }
    else if (new_pw!=re_new_pw){
        res.send("Mật khẩu mới không khớp!");
    }
    
    else if (rs) {
        const N = 10;
        const hash = bcrypt.hashSync(new_pw, N);
        const action = await userModel.changePass(req.session.authUser.user_name, hash);
        req.session.isAuthenticated = false;
        req.session.authUser = null;
        res.redirect('/account/login');
    }
});

router.post('/change_info', async (req, res) => {
    const cur_id = req.session.userInfo.id;
    const new_name = req.body.new_name;
    const new_email = req.body.new_email;
    const new_address = req.body.new_address;


    // await userModel.change_name(cur_id, new_name);
    // await userModel.change_email(cur_id, new_email);
    await userModel.change_info(cur_id, 'full_name', new_name);
    await userModel.change_info(cur_id, 'email', new_email);
    await userModel.change_info(cur_id, 'address', new_address);

    req.session.userInfo.full_name = new_name;
    req.session.userInfo.email = new_email;
    req.session.userInfo.address = new_address;


    res.redirect('/account/profile');
});
router.get('/err', (req, res) => {
    throw new Error('error occured');
});
module.exports = router;