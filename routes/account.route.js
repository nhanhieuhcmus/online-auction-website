const express=require('express');

const router=express.Router();
const bodyparser=require('body-parser');
const bcrypt=require('bcryptjs');

const userModel = require('../models/user.model');
const loginModel = require('../models/login.model');
var dateFormat = require('dateformat');
var urlencodedParser = bodyparser.urlencoded({ extended: false })

router.post('/',urlencodedParser,async(req,res)=>{
    const N = 10;
    const hash = bcrypt.hashSync(req.body.password, N);
    var maxID= await userModel.maxId();
    var datejoined = new Date();
    dateFormat(datejoined, "%Y-%m-%d");
    console.log(maxID);
    if (maxID==null) 
        maxID=0;
    // console.log(req.body.type_of_user);

    const entity_user={
        id:+maxID+1,
        full_name: req.body.fullname,
        email: req.body.email,
        address: req.body.address,
        date_of_birth: req.body.dob,
        date_joined: datejoined.toISOString(),
        type_of_user: +req.body.type_of_user,
        add_point: +0,
        minus_point: +0
    }; 
    
    const entity_login={
        id:+maxID+1,
        user_name: req.body.username,
        password: hash
    }; 
    

    const result = await userModel.add(entity_user);
    await loginModel.add(entity_login);
    const info = await userModel.single(entity_login.id); 
    res.render('home',
    {
        title: 'Trang chủ',
        user_name: info.user_name,
        new_product: info.type_of_user === 1 || info.type_of_user === 2,
        edit_categories: info.type_of_user === 1
    })
})

// Check account matching
router.post('/', async (req, res) => {
    const loginUser = await loginModel.singleByUsername(req.body.username);
    if (loginUser === null)
      throw new Error('Invalid username or password.');
  
    const rs = bcrypt.compareSync(req.body.password, loginUser.password);
    if (rs === false)
    //   return res.render('vwAccount/login', {
    //     layout: false,
    //     err_message: 'Login failed'
    //   });
        res.send('login failed!');
    res.send('login successfully!');
    // delete user.f_Password;
    // req.session.isAuthenticated = true;
    // req.session.authUser = user;
  
    // const url = req.query.retUrl || '/';
    // res.redirect(url);
  })
module.exports=router;