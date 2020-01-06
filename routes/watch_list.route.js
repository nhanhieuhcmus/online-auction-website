const express = require('express');
const watch_listModel = require('../models/watch_list.model');
const productModel = require('../models/product.model');
const offerModel = require('../models/offer.model');
const router = express.Router();


router.use(express.static('public/css'));

router.get('/', async (req, res) => {
    const rows = await productModel.favoriteByUser(req.session.authUser.id);
    rows.forEach(async i => {
        i.favorite = true;
        const isHoldPrice = await watch_listModel.isHoldPrice(req.session.authUser.id, i.id)
        if (isHoldPrice)
            i.isHoldPrice = true;
        else i.isHoldPrice = false;
    })
    res.render('watch_list',
        {
            title: 'Yêu thích',
            rows,
            empty: rows.lenght === 0,
        })
});

router.get('/auction-list', async (req, res) => {
    const rows = await offerModel.auctionList(req.session.authUser.id);
    rows.forEach(async i => {
        const isHoldPrice = await watch_listModel.isHoldPrice(req.session.authUser.id, i.id)
        if (isHoldPrice)
            i.isHoldPrice = true;
        else i.isHoldPrice = false;
    })
    res.render('watch_list',
        {
            title: 'Đang đấu giá',
            rows,
            empty: rows.lenght === 0
        })
});

router.get('/won-list', async (req, res) => {
    const rows = await offerModel.wonList(req.session.authUser.id);
    rows.forEach(async i => {
        const isHoldPrice = await watch_listModel.isHoldPrice(req.session.authUser.id, i.id)
        if (isHoldPrice)
            i.isHoldPrice = true;
        else i.isHoldPrice = false;
    })
    res.render('watch_list',
        {
            title: 'Đã thắng',
            rows,
            empty: rows.lenght === 0
        })
});

router.get('/purchase-list', async (req, res) => {
    const rows = await offerModel.purchaseList(req.session.authUser.id);
    rows.forEach(async i => {
        i.rating = true;
        const isHoldPrice = await watch_listModel.isHoldPrice(req.session.authUser.id, i.id)
        if (isHoldPrice)
            i.isHoldPrice = true;
        else i.isHoldPrice = false;
    })
    res.render('watch_list',
        {
            title: 'Có người mua',
            rows,
            empty: rows.lenght === 0
        })
});

router.get('/selling-list', async (req, res) => {
    const rows = await offerModel.sellingList(req.session.authUser.id);
    rows.forEach(async i => {
        const isHoldPrice = await watch_listModel.isHoldPrice(req.session.authUser.id, i.id)
        if (isHoldPrice)
            i.isHoldPrice = true;
        else i.isHoldPrice = false;
    })
    res.render('watch_list',
        {
            title: 'Đã thắng',
            rows,
            empty: rows.lenght === 0
        })
});

router.get('/:id', async (req, res) => {
    check = await watch_listModel.isFavorite(req.session.authUser.id, req.params.id);
    if (check)
        await watch_listModel.del({ user_id: req.session.authUser.id, product_id: req.params.id });
    else {
        await watch_listModel.add(req.session.authUser.id, req.params.id);
    }
    if (req.query.retUrl)
        retUrl = req.query.retUrl;
    else retUrl = '/';
    res.redirect(retUrl);
});

router.get('/err', (req, res) => {
    throw new Error('error occured');
});

module.exports = router;