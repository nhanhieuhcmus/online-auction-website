const express = require('express');
const productModel = require('../models/product.model');
const offerModel = require('../models/offer.model');
const categoryModel = require('../models/category.model');
const userModel = require('../models/user.model');
const moment = require('moment');
const multer = require('multer');
const dateFormat = require('dateformat');
const fs = require('fs')
const mkdirp = require('mkdirp');


const router = express.Router();

router.use(express.static('public/css'));

router.get('/', async (req, res) => {
  const category = await categoryModel.all();
  res.render('home',
    {
      title: 'Trang chủ',
      category,
      empty: category.length === 0
    })
})

router.get('/new-product', (req, res) => {
  res.render('vwProduct/newProduct',
    { title: 'Thêm sản phẩm mới' })
});

router.post('/new-product', async function (req, res) {
  const maxID = await productModel.maxId();
  var startDate = new Date();
  var endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);
  var start_date = dateFormat(startDate, "yyyy-mm-dd").toString();
  var end_date = dateFormat(endDate, "yyyy-mm-dd").toString();
  const entity = {
    id: +maxID + 1,
    categoryid: req.body.categoryid,
    detail: req.body.detail,
    name: req.body.name,
    id_seller: 2,
    start_price: req.body.start_price,
    step_price: req.body.step_price,
    instant_price: req.body.instant_price,
    start_date: start_date,
    end_date: end_date,
    current_price: req.body.start_price,
    priceholder: -1
  };
  // console.log(entity);
  const result = await productModel.add(entity);
  //console.log(result);
  res.redirect(`/category/new-product-image/${entity.id}/${entity.categoryid}`);
})

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  destination: function (req, file, cb) {
    var dest = `./public/imgs/sp/${req.params.id}/`;
    mkdirp.sync(dest);
    cb(null, dest);
  },
});

const upload = multer({ storage });

router.get('/new-product-image/:id/:categoryid', (req, res) => {
  res.render('vwProduct/newProductImage',
    { title: 'Thêm hình cho sản phẩm mới' })
});

router.post('/new-product-image/:id/:categoryid', async function (req, res) {
  upload.array('image', 3)(req, res, err => {
    if (req.files.length != 3) {
      res.send("You must upload exactly 3 images");
      return;
    }
    if (err instanceof multer.MulterError) {
      throw err;
    } else if (err) {
      throw err;
    }
    var newName = [`public\\imgs\\sp\\${req.params.id}\\main.jpg`, `public\\imgs\\sp\\${req.params.id}\\1.jpg`, `public\\imgs\\sp\\${req.params.id}\\2.jpg`];
    let index;
    for (index = 0; index < 3; index++) {
      fs.rename(req.files[index].path, newName[index], async function (err) {
        if (err) {
          console.log(err);
        } else {
          const category = await categoryModel.single(req.params.categoryid);
          const category_name = category[0].name_category;
          res.redirect(`/category/${category_name}`);
        }
      })
    }
  });
})

router.get('/:name', async function (req, res) {
  const rows = await productModel.allByCat(req.params.name);
  rows.forEach(element => {
    if (element.instant_price == null)
      element.instant_price = false;
    if (element.priceholder = null)
      element.priceholder = false;
    element.catName = req.params.name;
    element.start_date = moment(element.start_date).format('DD/MM/YYYY');
    element.end_date = moment(element.end_date).format('DD/MM/YYYY');
  });

  res.render('vwProduct/listProducts', {
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
  const sellerRows = await userModel.single(single.id_seller);
  i = 1;
  history.forEach(element => {
    element.BidId = i++;
  })
  single.forEach(element => {
    if (element.instant_price == null)
      element.instant_price = false;
    element.start_date = moment(element.start_date).format('DD/MM/YYYY');
    element.end_date = moment(element.end_date).format('DD/MM/YYYY');
    element.min_price = element.current_price + element.step_price
  });

  rows.forEach(element => {
    if (element.instant_price == null)
      element.instant_price = false;
    element.catName = req.params.name;
    element.start_date = moment(element.start_date).format('DD/MM/YYYY');
    element.end_date = moment(element.end_date).format('DD/MM/YYYY');
  });
  console.log(sellerRows);
  res.render('items', {
    catName: req.params.name,
    history,
    rows,
    seller: sellerRows[0],
    item: single[0],
    title: 'Chi tiết sản phẩm'
  });
})

router.post('/:name/:id', async (req, res) => {
  product = await productModel.single(+req.body.productId);
  currentOffer = await offerModel.currentOffer(+req.body.productId);
  if (currentOffer.length > 0)
    if (+req.body.price > currentOffer[0].price) {
      single = await offerModel.single(currentOffer[0].user, currentOffer[0].product, product[0].current_price);
      single[0].price = currentOffer[0].price;
      await offerModel.patch(single[0]);
      product[0].current_price = currentOffer[0].price + product[0].step_price;
      product[0].priceholder = +req.body.userId;
      console.log(product[0]);
      await productModel.patch(product[0]);
      await offerModel.patchOffer({
        product: +req.body.productId,
        user: +req.body.userId,
        price: +req.body.price
      })
    }
    else {
      single = await offerModel.single(currentOffer[0].user, currentOffer[0].product, product[0].current_price);
      single[0].price = +req.body.price;
      result = await offerModel.patch(single[0]);
      product[0].current_price = +req.body.price;
      await productModel.patch(product[0]);
    }
  else {
    product[0].priceholder = +req.body.userId;
    console.log(product[0]);
    await productModel.patch(product[0]);
    await offerModel.addWaitingOffer({
      product: +req.body.productId,
      user: +req.body.userId,
      price: +req.body.price
    })
  }

  entity = {
    product_id: +req.body.productId,
    user_id: +req.body.userId,
    price: +product[0].current_price,
  };
  entity.time = new Date();
  result = await offerModel.add(entity);
  res.redirect(`/category/${req.params.name}/${req.params.id}`);
});

router.get('/:name/:id/editor', async (req, res) => {
  // product = await productModel.single(req.params.id);
  res.render('vwEditor', {
    //detail: product[0].detail,
    title: 'Cập nhật mô tả'
  });
})

router.post('/:name/:id/editor', async (req, res) => {
  product = await productModel.single(req.params.id);
  product[0].detail += '<p><b>' + moment().format('DD/MM/YYYY hh:mm A') + '</b></p>' + req.body.FullDes;
  await productModel.patch(product[0]);
  res.redirect(`.`);
});


module.exports = router;