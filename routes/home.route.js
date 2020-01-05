const express = require('express');
const productModel = require('../models/product.model');
const watch_listModel = require('../models/watch_list.model');
const offerModel = require('../models/offer.model');
const categoryModel = require('../models/category.model');
const userModel = require('../models/user.model');
const moment = require('moment');


const router = express.Router();

router.use(express.static('public/css'));

router.get('/', async (req, res) => {
    const [hot, nearFinish, mostPrice, favorite] = await Promise.all([
        productModel.mostAuctionTimes(),
        productModel.nearFinish(),
        productModel.mostExpensive(),
        watch_listModel.all()
    ]);

    if (req.session.authUser) {
        data = [hot, nearFinish, mostPrice];
        data.forEach(i => {
            i.forEach(j => {
                favorite.forEach(element => {
                    if (element.user_id == req.session.authUser.id && element.product_id == j.id)
                        j.isFavorite = true;
                })
            })
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

router.get('/err', (req, res) => {
    throw new Error('error occured');
});

module.exports = router;