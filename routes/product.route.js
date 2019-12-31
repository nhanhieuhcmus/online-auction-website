const express = require('express');
const productModel = require('../models/product.model');
const router = express.Router();

router.use(express.static('public/css'));

router.get('/:id/list-product', async (req, res) => {

    // for (const c of res.locals.lcCategories) {
    //   if (c.CatID === +req.params.id) {
    //     c.isActive = true;
    //   }
    // }
  
    // const rows = await productModel.allByCat(req.params.id);
    // // const name_category = await productModel.catName(req.param.id);
    // res.render('vwProducts/listProduct', {
    // //   catName: name_category,
    //   products: rows,
    //   empty: rows.length === 0
    //});
  })
  

module.exports = router;