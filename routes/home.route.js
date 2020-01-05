const express = require('express');
const productModel = require('../models/product.model');
const offerModel = require('../models/offer.model');
const categoryModel = require('../models/category.model');
const userModel = require('../models/user.model');
const moment = require('moment');


const router = express.Router();

router.use(express.static('public/css'));

router.get('/', async (req, res) => {
    const [hot, nearFinish, mostPrice] = await Promise.all([
        productModel.mostAuctionTimes(),
        productModel.nearFinish(),
        productModel.mostExpensive()
    ]);
    const carosel_numbers = [];
    for (i = 1; i <= 5; i++) {
        carosel_numbers.push({
            value: hot[i],
            // isCurrentCarosel: i === +page
        })
    }
    nearFinish.forEach(element => {
        if (element.instant_price == null)
            element.instant_price = false;
        if (element.priceholder = null)
            element.priceholder = false;
        element.start_date = moment(element.start_date).format('DD/MM/YYYY');
        element.end_date = moment(element.end_date).format('DD/MM/YYYY');
    });
    mostPrice.forEach(element => {
        if (element.instant_price == null)
            element.instant_price = false;
        if (element.priceholder = null)
            element.priceholder = false;
        element.start_date = moment(element.start_date).format('DD/MM/YYYY');
        element.end_date = moment(element.end_date).format('DD/MM/YYYY');
    });

    res.render('home', {
        title: 'Trang chủ',
        hot,
        nearFinish,
        mostPrice,
    });
});

router.get('/home', function (req, res) {
    res.render('home', { title: 'Trang chủ' });
});

router.get('/err', (req, res) => {
    throw new Error('error occured');
});

module.exports = router;