const express = require('express');
const productModel = require('../models/product.model');
const watch_listModel = require('../models/watch_list.model');
const offerModel = require('../models/offer.model');
const categoryModel = require('../models/category.model');
const userModel = require('../models/user.model');
const moment = require('moment');
const restrict = require('../middlewares/auth.mdw');
const request = require('../models/request.model');
const ratingModel = require('../models/rating.model');
const isAdmin = (req, res, next) => {
    if (!res.locals.isAdmin)
        return res.redirect('/');

    next();
}
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

router.get('/req-list', restrict, isAdmin, async (req, res) => {
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

router.get('/rating/like/:send/:receive/:product', restrict, async (req, res) => {
    ratingModel.add({
        send_rating: req.params.send,
        receive_rating: req.params.receive,
        product_id: req.params.product
    })
    user = await userModel.single(req.params.receive);
    user[0].add_point++;
    await userModel.patch(user[0]);

    res.redirect(req.headers.referer);
})

router.get('/rating/dislike/:send/:receive/:product', restrict, async (req, res) => {
    ratingModel.add({
        send_rating: req.params.send,
        receive_rating: req.params.receive,
        product_id: req.params.product
    })
    user = await userModel.single(req.params.receive);
    user[0].minus_point++;
    await userModel.patch(user[0]);

    res.redirect(req.headers.referer);
})

router.post('/instant', restrict, async (req, res) => {
    product = await productModel.single(+req.body.productId);
    product[0].priceholder = req.session.authUser.id;
    product[0].current_price = +req.body.instant;
    product[0].end_date = new Date();
    await productModel.patch(product[0]);
    result = await offerModel.patchOffer({
        product: +req.body.productId,
        user: req.session.authUser.id,
        price: +req.body.instant
    });
    console.log(result.affectedRows)
    if (result.affectedRows == 0)
        await offerModel.addWaitingOffer({
            product: +req.body.productId,
            user: req.session.authUser.id,
            price: +req.body.instant
        });
    res.redirect(req.headers.referer);
})
router.get('/err', (req, res) => {
    throw new Error('error occured');
});

module.exports = router;