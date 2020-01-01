const express = require('express');
const productModel = require('../models/product.model');
const categoryModel = require('../models/category.model');
const moment= require('moment');
const router = express.Router();

router.use(express.static('public/css'));

router.get('/',async (req,res)=>{
    res.render('home', {title: 'Trang chủ'})
})

router.get('/:name', async function (req, res) { 
    console.log(req.params.name);
    const rows = await productModel.allByCat(req.params.name);
    rows.forEach(element => {
        if (element.instant_price == null)
            element.instant_price = false;
        if (element.priceholder = null)
            element.priceholder = false;
        element.start_date = moment(element.start_date).format('DD/MM/YYYY');
        element.end_date = moment(element.end_date).format('DD/MM/YYYY');
    });

    res.render('listProducts', {
        catName: req.params.name,
        products: rows,
        empty: rows.length === 0,
        title: 'Sản phẩm'
    });
})

module.exports = router;