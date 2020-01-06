const express = require('express');
const productModel = require('../models/product.model');
const watch_listModel = require('../models/watch_list.model');
const offerModel = require('../models/offer.model');
const categoryModel = require('../models/category.model');
const userModel = require('../models/user.model');
const moment = require('moment');
const restrict = require('../middlewares/auth.mdw');
const request = require('../models/request.model');

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
            i.forEach(async j => {
                favorite.forEach(element => {
                    if (element.user_id == req.session.authUser.id && element.product_id == j.id)
                        j.isFavorite = true;
                })
                const isHoldPrice = await watch_listModel.isHoldPrice(req.session.authUser.id, j.id)
                if (isHoldPrice)
                    j.isHoldPrice = true;
                else j.isHoldPrice = false;
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

router.post('/req/:id', restrict, async (req, res) => {
    await request.add({
        user_id: req.params.id
    })
    res.redirect(req.headers.referer);
})

router.get('/req-list', restrict, async (req, res) => {
    const rows = await request.all();
    res.render('vwRequest', {
        rows,
        empty: rows.length === 0
    })
})

router.post('/request/accept', restrict, async (req, res) => {
    const user = await userModel.single(req.body.user_id)
    user[0].type_of_user = 3;
    await userModel.patch(user[0]);
    const result = await request.del(req.body.user_id);
    res.redirect(req.headers.referer);
})

router.post('/request/deny', restrict, async (req, res) => {
    const result = await request.del(req.body.user_id);
    res.redirect(req.headers.referer);
})
router.get('/err', (req, res) => {
    throw new Error('error occured');
});

module.exports = router;