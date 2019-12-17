function hbsHelpers(hbs) {
    return hbs.create({
        defaultLayout: 'main.hbs',
        layoutsDir: 'views/_layouts',
        helpers: {
            print_category: function (categories, options) {
                var temp = categories.map(function (category) {
                    if (category.flag == -1) {
                        return "<li class=\"dropdown-submenu\">\n" + "<a class=\"dropdown-item\" tabindex=\"-1\" href=\"#\">" +
                            category.name_category + "</a>\n";
                        
                    }
                    else if (category.flag == 0){
                            return "<ul class=\"dropdown-menu\">\n" +
                                "<li class=\"dropdown-item\"><a tabindex=\"-1\" href=\"#\">" + category.name_category + "</a></li>";      
                    }
                    else if (category.flag == 1) {
                            return "<li class=\"dropdown-item\"><a href=\"#\">" +
                                category.name_category + "</a></li>\n" + "</ul>\n" + "\n</li>";
                    }
                });
                return temp.join("\n");
            }
        }
    })
    // More helpers...
}

module.exports = hbsHelpers;