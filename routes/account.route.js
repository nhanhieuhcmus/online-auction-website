const express=require('express');

const router=express.Router();
const bodyparser=require('body-parser');
const bcrypt=require('bcryptjs');

const userModel = require('../models/user.model');

var urlencodedParser = bodyparser.urlencoded({ extended: false })

router.post('/',urlencodedParser,async(req,res)=>{
    const N = 10;
    const hash = bcrypt.hashSync(req.body.password, N);

    const entity={
        user_name: req.body.username,
        password: hash
    };
    
    console.log(entity);
    const result = await userModel.add(entity);
    res.send('email: '+req.body.username+'<br>'+'password:'+entity.password+'<br>');

})
module.exports=router;