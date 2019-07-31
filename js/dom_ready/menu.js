// INCLUDE HEADER /start
function menu_zz_call() {
    var debug = false;
    var is_open = false;

    var win_w = window.innerWidth;
    var max_item = 9;
    var item_interator = 0;
    var tail_element = false;
    var h_plus = 37;
    if(win_w > 1024) {

        $(".menu-block-header .menu-items > .menu-item:not('.menu-price-list')").each(function(k, v){
            item_interator++;

            if(item_interator === max_item) {
                $(".menu-block-header .menu-items").css({
                    "padding-left":"20px",
                    "padding-right":"20px"});
                $(v).find(".dropshadow").remove();

                tail_element = $(v);

                if (tail_element.find(".menu-level-2").length === 0) {
                    console.log("Append");
                    tail_element.append("<div class='menu-level-2'></div>");
                } else {
                    console.log(tail_element.find(".menu-level-2"));
                }
            }
            if(item_interator > max_item) {
                tail_element.addClass("tail");
                $(v).find(".menu-level-2").remove();
                tail_element.find(".dropshadow").remove();
                tail_element.find(".menu-level-2").append($(v));
            }
        });
    }
    if(win_w > 1170) {
        var h_plus = 20;
    }

    var padding_bottom_start = 0;
    var margin_bottom_start = 0;

    if(tail_element) {

        tail_element.hover(function (e) {
            var item = $(this);
            var height = 0;
            item.addClass("open");
            padding_bottom_start = parseInt(item.css("padding-bottom"));
            margin_bottom_start = parseInt(item.css("margin-bottom"));

            item.find(".menu-level-2 .menu-item").each(function (k, v) {
                height += $(v).outerHeight();
            });
            console.log(height);
            item.css({"margin-bottom": -1 * (height + h_plus) + "px", "padding-bottom": (height + h_plus) + "px"});
        }, function (e) {
            var item = $(this);
            item.removeClass("open");
            item.css({
                "padding-bottom": padding_bottom_start + "px",
                "margin-bottom": (margin_bottom_start) + "px"
            });
        });
    }

    var menu_item = $(".menu-block-header .menu-items .menu-item:not(.tail)");
    menu_item.on("click, mouseover", function() {
        var has_sub = $(this).has(".menu-level-2").length;
        if(!is_open && has_sub) {
            var menu_level_2 = $(this).find(".menu-level-2");
            is_open = true;
            menu_item.removeClass("open");
            $(this).addClass("open");
            var win_w = window.innerWidth;
            var b = $(this).width();
            var w = menu_level_2.width();
            // Адаптив
            if(1170 > win_w && win_w >= 1024) {
                menu_level_2.css({"left": ( (b - w) / 2) + "px"});
            }
            // Выход за страницу
            var offset = menu_level_2.offset();
            var R = offset.left + w;
            var D = + $(".menu-block-header .menu-items").width() + $(".menu-block-header .menu-items").offset().left;

            if( !menu_level_2.attr('optimal') ) {
                if (R > D) {
                    var m_w = $(".menu-block-header .menu-items").width();
                    var P = (win_w - m_w) / 2;
                    var F = R - P;
                    var now_left = $(this).css('left').replace(/[^-\d\.]/g, '');
                    var left = now_left - (F - m_w);
                    menu_level_2.css({"left": left + "px"});
                    menu_level_2.attr({'optimal':true});
                }
            }
            var has = menu_level_2.has(".back").length;
            if (!has ) {
                var name = $(this).find("> a .menu-item-name").html();
                menu_level_2.prepend('<div class="back"><span class="korsar-icon arrow-back"></span><span class="name">' + name + '</span></div>');
            }
        }
   });
    menu_item.on("click, mouseout", function(e) {
        e.stopPropagation();
        if(is_open) {
            is_open = false;
            menu_item.removeClass("open");
        }
    });
    menu_item.on("click", ".back .arrow-back", function(e) {
        e.stopPropagation();
        $(this).closest(".open").removeClass("open");
        is_open = false;
    });


};
// INCLUDE HEADER /close