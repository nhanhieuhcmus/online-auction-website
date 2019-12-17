const express = require('express');
const categoryModel = require('../../models/category.model');

const router = express.Router();

router.use(express.static('public'));

router.get('/', async (req, res) => {

  try {
    const rows = await categoryModel.all();
    res.render('vwCategory/home.hbs', {
      category: rows,
      empty: rows.length === 0
    });
  } catch (err) {
    console.log(err);
    res.end('View error log in console.');
  }
})

module.exports = router;