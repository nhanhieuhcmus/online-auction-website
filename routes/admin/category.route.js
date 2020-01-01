const express = require('express');
const categoryModel = require('../../models/category.model');
const router = express.Router();

router.use(express.static('public/css'));

router.get('/',async (req,res)=>{
    const category= await categoryModel.all();
    res.render('home',
    {
       title: 'Trang chủ',
       category,
       empty: category.length===0
    })
});

router.get('/err', (req, res) => {
    throw new Error('error occured');
});

module.exports=router;