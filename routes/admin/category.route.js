const express = require('express');
const categoryModel = require('../../models/category.model');
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
});

router.get('/edit-category', async (req, res) => {
    const category = await categoryModel.all();
    res.render('vwCategory/editCategory',
        {
            title: 'Chỉnh sửa danh mục sản phẩm',
            category,
            empty: category.length === 0
        })
});

router.get('/add', (req, res) => {
    res.render('vwCategory/add', { title: 'Thêm danh mục' });
});

router.post('/add', async (req, res) => {
    const maxID = await categoryModel.maxId();
    const entity = {
        id: +maxID + 1,
        name_category: req.body.name_category
    };
    const result = await categoryModel.add(entity);
    //console.log(result);
    res.redirect('/admin/category/edit-category');
});

router.get('/edit/:id', async (req, res) => {
    const c = await categoryModel.single(req.params.id);
    if (c.length === 0)
        throw new Error('Danh mục không tồn tại');
    res.render('vwCategory/edit',
        {
            title: 'Chỉnh sửa danh mục',
            category: c[0]
        });
});

router.post('/patch', async (req, res) => {
    const result = await categoryModel.patch(req.body);
    // //console.log(result);
    res.redirect('/admin/category/edit-category');
});

router.post('/delete', async (req, res) => {
    const result = await categoryModel.del(req.body.id);
    //console.log(result.affectedRows);
    res.redirect('/admin/category/edit-category');
});

router.get('/err', (req, res) => {
    throw new Error('error occured');
});

module.exports = router;