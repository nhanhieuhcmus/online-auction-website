function hbsHelpers(hbs) {
    return hbs.create({
        defaultLayout: 'main.hbs',
        layoutsDir: 'views/_layouts',
        helpers: {
            format: function(product, option){
                if (product.now_price != null)
                    return '<p id="nearlyFi" class="card-text now_price">Giá mua ngay:' + product.now_price + 'đ</p>'
            }
        }
         // More helpers...
    })
   
}
module.exports = hbsHelpers;