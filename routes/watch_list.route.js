const express = require('express');
const watch_listModel = require('../models/watch_list.model');
const productModel = require('../models/product.model');
const router = express.Router();


router.use(express.static('public/css'));

router.get('/', async (req, res) => {
    const rows = await productModel.favoriteByUser(req.session.authUser.id);
    res.render('watch_list',
        {
            title: 'Trang chủ',
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