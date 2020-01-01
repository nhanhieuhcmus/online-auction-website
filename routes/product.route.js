const express = require('express');
const productModel = require('../models/product.model');
const moment=require('moment')
const router = express.Router();

router.use(express.static('public/css'));

router.get('/:name', async function (req, res) { 
  console.log(req.params.name);
  const rows = await productModel.allByCat(req.params.name);
  rows.forEach(element => {
      if(element.now_price==null)
          element.now_price=false;
          element.start_date=moment(element.start_date).format('DD/MM/YYYY');
          element.end_date=moment(element.end_date).format('DD/MM/YYYY');
  });

  rows.forEach(element => {
    element.catName=req.params.name
  });
  res.render('listProducts', {
      catName:req.params.name,
      products: rows,
      empty: rows.length === 0,
      title: 'Sản phẩm'
  });
});

router.get('/:name/:id', async function(req, res) {
  const single = await productModel.single(req.params.id);
  single.forEach(element => {
      if(element.now_price==null)
          element.now_price=false;
          element.start_date=moment(element.start_date).format('DD/MM/YYYY');
          element.end_date=moment(element.end_date).format('DD/MM/YYYY');
  });
  res.render('items', {
      item: single[0],
      title: 'Chi tiết sản phẩm'
  });
})

router.post('/:name/:id',async (req,res)=>{
  // entity = {
  //     product_id: +req.body.productId,
  //     user_id: +req.body.userId,
  //     price: +req.body.price,
  // };
  // const result = await offerModel.add(entity);
  // // console.log(result);
   res.redirect(`${req.params.id}`);
});

module.exports = router;