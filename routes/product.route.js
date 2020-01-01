const express = require('express');
const productModel = require('../models/product.model');
const offerModel = require('../models/offer.model');
const categoryModel = require('../models/category.model');
const moment = require('moment');
const router = express.Router();

router.use(express.static('public/css'));

router.get('/:name', async function (req, res) {
  console.log(req.params.name);
  const rows = await productModel.allByCat(req.params.name);
  rows.forEach(element => {
    if (element.now_price == null)
      element.now_price = false;
    element.start_date = moment(element.start_date).format('DD/MM/YYYY');
    element.end_date = moment(element.end_date).format('DD/MM/YYYY');
  });

  rows.forEach(element => {
    element.catName = req.params.name
  });
  res.render('listProducts', {
    catName: req.params.name,
    products: rows,
    empty: rows.length === 0,
    title: 'Sản phẩm'
  });
});

router.get('/:name/:id', async function (req, res) {
  const [single, history, rows] = await Promise.all([
    productModel.single(req.params.id),
    offerModel.allByProductId(req.params.id),
    productModel.allByCat(req.params.name)
  ]);
  i = 1;
  history.forEach(element => {
    element.BidId = i++;
  })
  single.forEach(element => {
    if (element.now_price == null)
      element.now_price = false;
    element.start_date = moment(element.start_date).format('DD/MM/YYYY');
    element.end_date = moment(element.end_date).format('DD/MM/YYYY');
    element.min_price = element.current_price+element.step_price
  });

  rows.forEach(element => {
    if (element.now_price == null)
      element.now_price = false;
    element.catName = req.params.name;
    element.start_date = moment(element.start_date).format('DD/MM/YYYY');
    element.end_date = moment(element.end_date).format('DD/MM/YYYY');
  });

  res.render('items', {
    catName: req.params.name,
    history,
    rows,
    item: single[0],
    title: 'Chi tiết sản phẩm'
  });
})

router.post('/:name/:id', async (req, res) => {
  // entity = {
  //     product_id: +req.body.productId,
  //     user_id: +req.body.userId,
  //     price: +req.body.price,
  // };
  // entity.time=new Date();
  // const result = await offerModel.add(entity);
  product = await productModel.single(+req.body.productId);
  product[0].current_price = +req.body.price;
  await productModel.patch(product[0]);
  // console.log(result);
  res.redirect(`${req.params.id}`);
});

router.get('/:name/:id/editor', async (req, res) => {
  product = await productModel.single(req.params.id);
  res.render('vwEditor', {
    detail: product[0].detail,
    title: 'Cập nhật mô tả'
  });
})

router.post('/:name/:id/editor', async (req, res) => {
  product = await productModel.single(req.params.id);
  product[0].detail = req.body.FullDes;
  await productModel.patch(product[0]);
  res.redirect(`.`);
})
module.exports = router;