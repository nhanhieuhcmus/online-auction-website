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
const config = require('../config/default.json')
const restrict = require('../middlewares/auth.mdw');
const bannedModel = require('../models/banned.model');


const router = express.Router();

router.use(express.static('public/css'));

router.get('/', (req, res) => {
  res.render('home', { title: 'Trang chủ' })
})

router.get('/new-product', restrict, (req, res) => {
  res.render('vwProduct/newProduct',
    { title: 'Thêm sản phẩm mới' })
});

router.post('/new-product', restrict, async function (req, res) {
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

router.post('/new-product-image/:id/:categoryid', restrict, async function (req, res) {
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

router.get('/search', async (req, res) => {
  switch (req.query.sortMode) {
    case 'priceDown':
      condition = '1';
      column = 'current_price';
      type = 'DESC';
      break;
    case 'end_timeUp':
      condition = 'end_date - NOW() > 0';
      column = 'end_date - NOW()';
      type = 'ASC';
      break;
    case 'start_timeUp':
      condition = 'start_date - NOW() > 0';
      column = 'start_date - NOW()';
      type = 'DESC';
      break;
    default:
      condition = '1';
      column = 'current_price';
      type = 'ASC';
      break;
  }

  const key = req.query.searchKey;
  const limit = config.paginate.limit;
  var page = req.query.page || 1;
  if (page < 1) page = 1;
  const offset = (page - 1) * limit;

  const [total, rows] = await Promise.all([
    productModel.countForSearch(key),
    productModel.sortSearchResult(key, offset, condition, column, type)
  ]);

  let nPages = Math.floor(total / limit);
  if (total % limit > 0) nPages++;
  const page_numbers = [];
  for (i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page
    })
  }

  rows.forEach(element => {
    if (element.instant_price == null)
      element.instant_price = false;
    if (element.priceholder = null)
      element.priceholder = false;
    element.start_date = moment(element.start_date).format('DD/MM/YYYY');
    element.end_date = moment(element.end_date).format('DD/MM/YYYY');
  });
  res.render('vwProduct/resultSearch', {
    key,
    products: rows,
    empty: rows.length === 0,
    title: 'Result for ' + key,
    page_numbers,
    prev_value: +page - 1,
    next_value: +page + 1,
    Paginate: nPages > 1,
    notMinPage: page > 1,
    notMaxPage: page < nPages
  });
});

// router.get('/search/priceDown', (req, res) => {
//   functions(req, res, '1', 'current_price', 'DESC');
// });

// router.get('/search/timeDown', (req, res) => {
//   functions(req, res, 'end_date - NOW() > 0', 'end_date - NOW()', 'ASC');
// });

// router.get('/search/timeUp', (req, res) => {
//   functions(req, res, 'start_date - NOW() > 0','start_date - NOW()', 'ASC');
// });

router.get('/:name', async function (req, res) {
  const catName = req.params.name;
  const limit = config.paginate.limit;
  var page = req.query.page || 1;
  if (page < 1) page = 1;
  const offset = (page - 1) * limit;

  const [total, rows] = await Promise.all([
    productModel.countByCat(catName),
    productModel.pageByCat(catName, offset)
  ]);

  let nPages = Math.floor(total / limit);
  if (total % limit > 0) nPages++;
  const page_numbers = [];
  for (i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page
    })
  }

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
    catName,
    products: rows,
    empty: rows.length === 0,
    title: 'Sản phẩm',
    page_numbers,
    prev_value: +page - 1,
    next_value: +page + 1,
    Paginate: nPages > 1,
    notMinPage: page > 1,
    notMaxPage: page < nPages
  });
});

router.get('/:name/:id', async function (req, res) {
  const [single, history, rows] = await Promise.all([
    productModel.single(req.params.id),
    offerModel.allByProductId(req.params.id),
    productModel.allByCat(req.params.name)
  ]);
  bestAution = {};
  const sellerRows = await userModel.single(single[0].id_seller);
  i = 1;
  history.forEach(element => {
    element.BidId = i++;
  }) 
  if (history != false) {
    const Aution = await userModel.single(history[0].user_id);
    bestAution = Aution[0];
  }
  single.forEach(element => {
    if (element.instant_price == null)
      element.instant_price = false;
    element.start_date = moment(element.start_date).format('DD/MM/YYYY hh:mm');
    //element.end_date = moment(element.end_date).format('DD/MM/YYYY hh:mm');
    element.min_price = element.current_price + element.step_price
  });

  rows.forEach(element => {
    if (element.instant_price == null)
      element.instant_price = false;
    element.catName = req.params.name;
    element.start_date = moment(element.start_date).format('DD/MM/YYYY');
    element.end_date = moment(element.end_date).format('DD/MM/YYYY');
  });
  res.render('items', {
    catName: req.params.name,
    bestAution,
    history,
    rows,
    Auction: req.query.Auction || false,
    Error: req.query.Error || false,
    seller: sellerRows[0],
    item: single[0],
    title: 'Chi tiết sản phẩm'
  });
})

router.post('/:name/:id', restrict, async (req, res) => {
  user = await (userModel.single(req.session.authUser.id));
  banned = await (bannedModel.single(req.session.authUser.id, req.params.id));
  console.log(banned);
  point = true;
  if (user[0].minus_point != 0)
    if (user[0].add_point / (user[0].add_point + user[0].minus_point) * 100 < 80)
      point = false;
  if (point == false || banned != false) {
    res.redirect('?Error=true');
  }
  else {
    product = await productModel.single(req.params.id);
    currentOffer = await offerModel.currentOffer(req.params.id);
    //console.log(currentOffer);
    if (currentOffer.length > 0)
      if (+req.body.price > currentOffer[0].price) {
        single = await offerModel.single(currentOffer[0].user, currentOffer[0].product, product[0].current_price);
        single[0].price = currentOffer[0].price;
        await offerModel.patch(single[0]);
        product[0].current_price = currentOffer[0].price + product[0].step_price;
        product[0].priceholder = req.session.authUser.id;
        await productModel.patch(product[0]);
        await offerModel.patchOffer({
          product: req.params.id,
          user: req.session.authUser.id,
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
      product[0].priceholder = req.session.authUser.id;
      await productModel.patch(product[0]);
      await offerModel.addWaitingOffer({
        product: req.params.id,
        user: req.session.authUser.id,
        price: +req.body.price
      })
    }

    entity = {
      product_id: req.params.id,
      user_id: req.session.authUser.id,
      price: +product[0].current_price,
    };
    entity.time = new Date();
    result = await offerModel.add(entity);
    res.redirect('?Auction=true');
  }
  //res.redirect(`/category/${req.params.name}/${req.params.id}`);
});

router.get('/:name/:id/editor', async (req, res) => {
  res.render('vwEditor', {
    title: 'Cập nhật mô tả'
  });
})

router.post('/:name/:id/editor', restrict, async (req, res) => {
  product = await productModel.single(req.params.id);
  product[0].detail += '<p><b>' + moment().format('DD/MM/YYYY hh:mm A') + '</b></p>' + req.body.FullDes;
  await productModel.patch(product[0]);
  res.redirect(`.`);
});

router.get('/err', (req, res) => {
  throw new Error('error occured');
});

router.post('/ban/:proId/:userId', restrict, async (req, res) => {
  await bannedModel.add({
    user_id: req.params.userId,
    product_id: req.params.proId
  });
  await offerModel.del(req.params.userId, req.params.proId);
  history = await offerModel.allByProductId(req.params.proId);
  
  product = await productModel.single(req.params.proId);
  
  if (history[0].user_id != product[0].priceholder) {
    product[0].priceholder = history[0].user_id;
    product[0].current_price = history[0].price;
    await offerModel.patchOffer({
      product: req.params.proId,
      user: history[0].user_id,
      price: history[0].price
    })
    await productModel.patch(product[0]);
  }
  res.redirect(req.headers.referer);
})
module.exports = router;