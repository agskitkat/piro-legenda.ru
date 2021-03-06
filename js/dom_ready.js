function zz_auth_modal() {

}

// include where
function cart_zz_call() {
    var debug = true;
    var url = "/local/ajax/add2basket_v2.php";


    $(".mass-volume .mass").html( hms( $(".mass-volume .mass").html() ) );
    $(".mass-volume .volume").html( hms( $(".mass-volume .volume").html() ) );

    if(window.innerWidth >= 1024) {
        $(".info-wrapper").stick_in_parent({offset_top: 80});
        $("#bx-soa-total").stick_in_parent({offset_top: 100});

    }

    if(window.innerWidth >= 1170) {
        $(".cart-v2-wrapper .info").stick_in_parent({offset_top: 80});
    }

    var cart = [];

    $('.good_quantity_block .increment, .add-control .increment').click(function() {
        var input = $(this).parent().find("input");
        var quantity = parseInt(input.val());
        var max_quantity = parseInt(input.attr('max'));
        if(!max_quantity) {
            max_quantity = 9999999;
        }
        console.log(quantity, max_quantity);

        if(quantity < max_quantity) {
            console.log(quantity+" < "+max_quantity);
            quantity++;
            input.val(quantity);
            if (quantity > 1) { // Включаем убавление
                $(this).parent().find(".decrement").removeClass('disabled');
            }
            update_total_price(quantity);
        }

        if(quantity >= max_quantity) {
            $(this).parent().find(".increment").addClass('disabled');
        }
    });

    $('.good_quantity_block .decrement, .add-control .decrement').click(function() {
        if($(this).closest(".good_quantity_block").is(".disabled")) {
            return false;
        }

        var quantity = $(this).parent().find("input").val();
        var max_quantity = $(this).parent().find("input").attr('max');
        if(!max_quantity) {
            max_quantity = 9999999;
        }


        quantity--;
        if(quantity < max_quantity) { // Включаем прибавление
            $(this).parent().find(".increment").removeClass('disabled');
        }

        if( !$(this).hasClass('disabled')) {
            $(this).parent().find("input").val(quantity);
            if (quantity === 1) {
                $(this).addClass('disabled');
            }
        }
        if(quantity > 0) {
            update_total_price(quantity);
        }
    });
    update_total_price(1);

    $('.good_quantity_block input').change(function(){
        var quantity = $(this).val();
        update_total_price(quantity);
    });

    function update_total_price(quantity) {
        if ( $(".good_content .good_offer .total_good_sum_block").html()) {
            var price = $(".good_content .good_offer .total_good_sum_block").attr('data-price');
            price = parseInt(price, 10);
            $(".good_content .good_offer .total_good_sum").html((price * quantity) + " руб.");
        }
    }

    $('.add_to_cart_block .add_button').click(function() {

        var button = $(this);
        if(!button.is(".error") && !button.is(".disabled")) {
            var ID = button.attr("data-product-id") ? $(this).attr("data-product-id") : false;
            if (ID) {
                var bv = button.parent().find("input").val();
                var quantity = bv ? bv : 1;
                var good_id = button.parent().find("input").attr('good_id');
                var name = button.closest(".good").find(".good_name a").text();

                button.html("<div class=\"loader_button\"></div>").addClass("active");
                setTimeout(function () {
                    to_cart("add", ID, quantity, function (data) {
                        if (!data) {
                            button.html("ОШИБКА").removeClass("active").addClass("error");
                            setTimeout(function () {
                                button.html("Повторите попытку").removeClass("error")
                            }, 3000);
                            return false;
                        }

                        if (data.quantity) {
                            update_mini_cart(data.price, data.quantity);
                            button.html("ДОБАВЛЕНО");

                            add_to_cart_message(button);

                            //Yandex
                            dataLayer.push({
                                "ecommerce": {
                                    "add": {
                                        "products": [
                                            {
                                                "id": good_id,
                                                "name": name,
                                                "price": data.price,
                                                "category": "Аксессуары/Сумки",
                                                "quantity": quantity
                                            }
                                        ]
                                    }
                                }
                            });

                            setTimeout(function () {
                                button.html("КУПИТЬ").addClass("active");
                            }, 5000);
                        } else {
                            button.html("Нет в наличии").removeClass("active").addClass("disabled");
                        }
                    });
                }, 500);
            } else {
                button.html("ОШИБКА").removeClass("active").addClass("error");
                setTimeout(function () {
                    button.html("Повторите попытку").removeClass("error")
                }, 3000);
            }
        }
    });

    $('.good .remove').click(function() {
        var button = $(this);
        var container = $(this).closest(".good");
        var ID = button.find("a").attr("data-product-id");
        if(!ID) {
            ID = button.attr("data-product-id");
        }

        var bv = button.parent().find("input").val();
        var quantity = bv ?  bv : 1;

        container.css({"opacity":"0"});

        to_cart("delete", ID, quantity, function(data) {
            // TODO Делать удалить товар
            update_mini_cart(data.price, data.quantity);
            update_cart(data);
            checkOrderDisable(data.base_price);
            container.remove();
        });
    });

    $('.good input').change(function() {
        var quantity = $(this).val();
        var ID = $(this).attr("data-product-id");

        if(quantity >= 1) {
            to_cart("update", ID, quantity, function(data) {
                update_mini_cart(data.price, data.quantity);
                update_cart(data);
                checkOrderDisable(data.base_price);
            });
        } else {
            var container = $(this).closest(".good");
            container.css({"opacity":"0"});
            to_cart("delete", ID, quantity, function(data) {
                update_mini_cart(data.price, data.quantity);
                update_cart(data);
                checkOrderDisable(data.base_price);
                container.remove();
            });

        }
    });

    $('.page-cart .add-control, .cart-v2-wrapper .btn-block').each(function(k, v){
        var quantity = $(this).find("input").val();
        if(quantity > 1) {
            $(this).find(".decrement").removeClass('disabled');
        }
    });

    $('.page-cart .add-control .increment, .cart-v2-wrapper .btn-block .increment').unbind('click').click(function() {
        var quantity = $(this).parent().find("input").val();
        var ID = $(this).closest(".add-control").find(".count").attr("data-product-id");
        if(!ID) {
            ID =  $(this).parent().find("input").attr("data-product-id");
        }
        quantity++;
        $(this).parent().find("input").val(quantity);
        if(quantity > 1) {
            $(this).parent().find(".decrement").removeClass('disabled');
        }
        to_cart("update", ID, quantity, function(data) {
            update_mini_cart(data.price, data.quantity);
            update_cart(data);
            checkOrderDisable(data.base_price);
        });
    });

    $('.page-cart .add-control .decrement, .cart-v2-wrapper .btn-block .decrement').unbind('click').click(function() {
        var quantity = $(this).parent().find("input").val();
        var ID = $(this).closest(".add-control").find(".count").attr("data-product-id");
        if(!ID) {
            ID =  $(this).parent().find("input").attr("data-product-id");
        }
        quantity--;
        if( !$(this).hasClass('disabled')) {
            $(this).parent().find("input").val(quantity);
            if (quantity === 1) {
                $(this).addClass('disabled');
            }
        }
        to_cart("update", ID, quantity, function(data) {
            update_mini_cart(data.price, data.quantity);
            update_cart(data);
            checkOrderDisable(data.base_price);
        });
    });

    function to_cart(action, good, quantity, callback) {
        var sessionId = BX.bitrix_sessid();

        var obj = {
            type: action,
            product_id: good
        }
        if(quantity) {
            obj.quantity = +quantity;
        }
        var jsonData = JSON.stringify(obj);

 
        $.ajax({
            url:url+"?sessid="+sessionId,
            type:"POST",
            data: { sessid:sessionId, site_id: BX.message('SITE_ID'), jsonData: obj },
            success: function(data){
                $.ajax({
                    url: url + "?sessid=" + sessionId,
                    type:"POST",
                    success: function(data) {
                        callback(data);
                    }
                });
            },
            error: function(data){
                callback(data);
            }
        })
    }

    $(".cart-v2-wrapper .present-add").click(function(){
        add_present(this);
    });

    function add_present(el) {
        var obj = {
            type: 'add',
            product_id: 10015,
            quantity: 1,
            precent: 'Y'
        }
        var jsonData = JSON.stringify(obj);
        $.post( url, jsonData,  function( data ) {
            window.location.reload(false);
        }).fail(function(){
            el.html("Ошибка, повторите.")
        });
    }

    function update_mini_cart(p, i) {
        if(!i) {
            p = 0;
        }

        if( $(document).width() < 1024) {
            if(i >= 100) {
                i = "+99";
            }
            $(".cart-block-header .items-count, .enter-cart .count-price .count").html(i);
        } else {
            $(".cart-block-header .items-count, .enter-cart .count-price .count").html(i+ " <span class=\"items-name\">"+declOfNum(+i, ["тов.","тов.","тов."])+"</span>");
        }

        $(".cart-block-header .cart-sum").html("<div class=\"cart-sum\">"+p+"</div>");
        $(".enter-cart .count-price .price").html(p);
    }

    function checkOrderDisable(p) {
        p = p.replace(/\s/g, '');
        p  = parseInt(p);
        if(p < -1) {
            $(".info-wrapper .btn-block .button, .btn-block-desctop .button").addClass("disabled");
            $(".info-wrapper .btn-block .button, .btn-block-desctop .button").parent().find(".cart-min-order-sum").removeClass("disabled");
        } else {
            $(".info-wrapper .btn-block .button, .btn-block-desctop .button").removeClass("disabled");
            $(".info-wrapper .btn-block .button, .btn-block-desctop .button").parent().find(".cart-min-order-sum").addClass("disabled");
        }

    }

    function update_cart(data) {
        present_view(data.basket_sum_include_offer_sale ? data.basket_sum_include_offer_sale : 0);

        $(".cart-calc .sum, .cart-v2-wrapper .profit .price").html((data.goodPrice ? data.goodPrice : 0) + "*");
        $(".cart-info .sum").html((data.price ? data.price : 0));
        $(".cart-info .sum.sale_off").html((data.base_price ? data.base_price : 0));

        $(".cart-v2-wrapper .order_price_real").html((data.price ? data.price : 0));

        $(".cart-v2-wrapper .oredr_price_base").html((data.basket_sum_include_offer_sale ? data.basket_sum_include_offer_sale : 0));
        $(".cart-v2-wrapper .sale_programm").html("-"+(data.profit_of_my_discount_programm ? data.profit_of_my_discount_programm : 0));

        $(".cart-specific .pair:first .value, .mass-volume .mass").html((data.weight ? hms(data.weight) :0));
        $(".cart-specific .pair:last .value, .mass-volume .volume").html((data.size ?  hms(data.size) : 0));

        var diskount_precents = data.diskount_precents ? "-" + data.diskount_precents + "% cкидкa" : "";

        $(".info-1 .sale-value").html(diskount_precents);
        $(".cart-v2-wrapper .discout_p").html(data.diskount_precents);

        $(".cart-v2-wrapper .count_items").html(data.count_item);


        // Каждый обновляем
        $(data.items).each(function(k, v){
            var good = $(".cart-v2-wrapper .good-"+v.id);
            good.find(".price .price-normal, .price .price-sale").html(v.basket_price);
            good.find(".price .price-old").html(v.basket_price_base)
            good.find(".price .price-normal").html(v.basket_price);
            good.find(".total_good_sum_block .one_item_price").html(v.one_item_price);



            if(v.count > 1) {
                console.log(true, v.count);
                good.find(".total_good_sum").css({"display":"none"});
                good.find(".total_good_sum.big").css({"display":"block"});
            } else {
                console.log(false, v.count);
                good.find(".total_good_sum").css({"display":"none"});
                good.find(".total_good_sum:not(.big)").css({"display":"block"});
            }
        });



    }

    $(".info-wrapper .btn-block .button, .btn-block-desctop .button").click( function(e) {
        e.preventDefault();
        if(!$(this).hasClass("disabled")) {
            window.location = $(this).attr("href");
        } else {
           var e = $(this).parent().find(".cart-min-order-sum");
            for(var i=0;i<3;i++) {
                $(e).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
            }
        }
    });


    var h  = $(".cart-category .goods .good:last").prev().innerHeight();
    $(".cart-category .goods .good:last").css({"height":h+"px"});

    if(window.innerWidth < 1024) {
        $(".cart-mobile-slider").each(function() {

            var slider = $(this).find('.goods');
            slider.max_height = 0;
            slider.slides = slider.find('.good').length;
            slider.max_width = 0;
            slider.min_left_margin = 0;

            function sliderResize() {
                var width = 0;
                slider.find('.good').each(function() {
                    var good = $(this);
                    width = good.innerWidth();
                    slider.max_height = (good.outerHeight() >  slider.max_height) ? good.outerHeight() :  slider.max_height;
                });
                slider.max_width = (slider.slides * width);
                slider.max_last_item_view = slider.max_width - width;
                slider.css({"height": (slider.max_height+40)+"px", width: slider.max_width + "px"});

                slider.find(".good:last").css({"height":(slider.max_height)+"px"});

                if(window.innerWidth > (width+(width/2)) && window.innerWidth <= (width*2+(width/2))) {
                    slider.min_left_margin = (window.innerWidth / 2 ) - (width/2);
                    slider.css({"margin-left": slider.min_left_margin + "px"});
                }

            }
            sliderResize();

            // Control swipe
            var start_margin = 0;
            var start_x = 0;

            slider.bind('touchstart', function (e) {
                start_margin = parseInt(slider.css("margin-left"));
                start_x = e.originalEvent.touches[0].pageX;
            });
            slider.bind('touchmove', function (e) {
                var move_x =  e.originalEvent.touches[0].pageX;
                var mew_margin = (start_margin + ((start_x - move_x)*-1));
                if(mew_margin*-1 > slider.min_left_margin*-1 && mew_margin*-1 < slider.max_last_item_view ) {
                    slider.css({"margin-left":mew_margin + "px"});
                }

            });
        });
    }

    var is_message_show = false;
    var message_destroy_timer = null;
    function add_to_cart_message(obj) {
        var image_src = null;

        image_src =  $(obj).closest(".good").find(".good_image img").attr("src");
        if(!image_src) {
            image_src = $(obj).closest(".good_content").find(".good_image_block img").attr("src");
        }

        if(is_message_show) {
            clearTimeout(message_destroy_timer);
            $("body").find(".message-add-to-cart").remove();
        }

        is_message_show = true;

        var output = '<div class="container-3-fixed message-add-to-cart">\n' +
            '    <a href="/personal/cart/" class="push-up">\n' +
            '        <div class="image" style="background-image:url(\''+image_src+'\')"></div>\n' +
            '        <div class="text">Товар добавлен в корзину</div>\n' +
            '    </a>\n' +
            '</div>';
        $("body").append(output);
        $("body").find(".message-add-to-cart").fadeIn(200, function() {});


        message_destroy_timer = setTimeout(function() {
           $("body").find(".message-add-to-cart").fadeOut(200, function() { $(this).remove(); });
           is_message_show = false;
        }, 2200);
    }


    function present_view(p) {
        p = p.toString().replace(" ", "");
        p = parseInt(p);
        if(p <= 49900) {
            if(p) {
                p = p.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, " ");
            }
            $(".cart-v2-wrapper .present .present-add").css({"display":"none"});
            $(".cart-v2-wrapper .present .present-add-show").html("До подарка осталось: "+(49900 - p) + " руб.").css({"display":"block"});
        } else {
            $(".cart-v2-wrapper .present .present-add").css({"display":"block"});
            $(".cart-v2-wrapper .present .present-add-show").css({"display":"none"});
        }
    }
};
function delivery_tab() {

    $(".delivery-tree .header-main").click(function(){
        $(".delivery-tree .col").removeClass("active").find(".delivery-tree-item").hide();
        $(this).closest(".col").addClass("active").find(".delivery-tree-item").show();
        if($( window ).width() >= 768) {
            var h = 0;
            $.each($(this).closest(".col").find(".delivery-tree-items .delivery-tree-item"), function (k, e) {

                h = h + $(e).height();
            });
            $(this).closest(".delivery-tree").height(h);
        }
    });
}
var liveSearch = function(config) {
    console.log(config);
    var MIN_QUERY_LEN = config.MIN_QUERY_LEN ? config.MIN_QUERY_LEN : 3;

    var limitExecByInterval = function(fn, time) {
        var lock, execOnUnlock, args;
        return function() {
            args = arguments;
            if (!lock) {
                lock = true;
                var scope = this;
                setTimeout(function(){
                    lock = false;
                    if (execOnUnlock) {
                        args.callee.apply(scope, args);
                        execOnUnlock = false;
                    }
                }, time);
                return fn.apply(this, args);
            } else execOnUnlock = true;
        }
    }

    var result = [];
    var searchItemsBySearchString  = limitExecByInterval(function(str) {

        $.post("/local/ajax/search.php",{
            'ajax_call':'y',
            'q':str,
            'l':MIN_QUERY_LEN,
            'INPUT_ID':config.INPUT_ID
        }, function( data ) {
            result = JSON.parse(data);
            searchResultUpdate();
        });
    }, 1000);

    var searchResultUpdate = function(){

        $("#"+config.INPUT_ID).closest(".fieldset-drop-live").find(".live-search-result").remove();

        if(result.length) {
            $("#" + config.INPUT_ID).closest(".fieldset-drop-live").append('<div class="live-search-result"></div>');

            var container = $("#" + config.INPUT_ID).closest(".fieldset-drop-live").find(".live-search-result");

            $.each(result, function (k, v) {
                container.append('<a href="' + v.URL + '">\n' +
                    '<img src="' + v.IMAGE + '" data-loaded="true" style="opacity: 1;">\n' +
                    '<p>' + v.TITLE + '</p>\n' +
                    '</a>');
            });

            console.log(container[0]);

            new SimpleBar(container[0]);
        }
    }

    $("#"+config.INPUT_ID).keyup(function () {

        var val = $(this).val();

        if(val.length >= MIN_QUERY_LEN) {
            searchItemsBySearchString(val);
        } else {
            result = [];
            searchResultUpdate();
        }
    });
};
// Login page /start
function login_zz_call() {
    function fragment(fragmentClass) {
        $(".fragments .active").removeClass("active");
        $("."+fragmentClass).addClass("active");
        centerdAlternative();
    }
    $(".fragmentChanger").click(function() {
        var fragmentClass = $(this).attr("data");
        console.log(fragmentClass);
        fragment(fragmentClass);
    }); 
    /*
    function centerdAlternative() {
        var e = $(".fragments .active .alternative");
        var ww = $(".fragments .active").width();
        var w = e.width();
        $(".alternative").css({"margin-left": (ww - w) / 2  + "px"});
        console.log({
            window:ww,
            w:w,
            result: ww-w
        });
    } */
    //centerdAlternative();
};
// Login page /stop
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
// Include on ORDER PAGE !!!  /open
/*
"use strict";
$().ready(function() {
    // Filter check
    $(".delivery-option").click(function () {
        $(this).parent().find(".current").removeClass("current");
        $(this).addClass("current");
        $(".page-order .forms .step-1").css({"opacity":"1"});
        $(".page-order .forms .form-header").css({"opacity":"1"});
        switch_delivery();
    });
    // First check
    $(".delivery-option").find("input:checked").parent().addClass("current");

    var chs = "";
    function switch_delivery() {
        chs =  $(".delivery-option").find("input:checked").val();

        $(".pay-system").find("input:checked").parent().addClass("current");

        $(".del-russia").css({"display":"none"});
        $(".del-moscow").css({"display":"none"});
        $(".del-none-display").css({"display":"none"});
        $(".del-none").css({"display":"block"});

        switch (chs) {
            case "del-russia" :
                $(".del-russia").css({"display":"block"});
                break;
            case "del-moscow" :
                $(".del-moscow").css({"display":"block"});
                break;
            case "del-none" :
                $(".del-none").css({"display":"none"});
                $(".del-none-display").css({"display":"block"});
                break;
        }
    }
    switch_delivery();

    // Filter check
    $(".pay-system .item").click(function() {
        $(this).parent().find(".current").removeClass("current");
        $(this).addClass("current");
    });
    // First check
    $(".pay-system").find("input:checked").parent().addClass("current");

    // Проверка и отправка формы step-1
    $(".save-lk").click(function() {
        // Делать проверку полей
        if(check_form($(".step-1"))) {
            // TODO ajax save data here
            // В идеале получить прошлый адрес доставки и заполнить форму SыыTEP-2
            var ajax = true;
            if(ajax) {
                $(".step-2").css({"display":"block"});
                $(".step-2").css({"opacity":"1"});
                $(this).html("СОХРАНЕНО");
                $(".form-down-block .disabled").removeClass("disabled");
            }
        }
    });



    $("input.kladr").kladr({
        oneString: true
    });


    function cost_adress_action_dilevery(address) {
        $(".deliviry-cost .cost").html("Расчёт стоимости...");
        getDistanceByAddress(address, function (distance) {
            var coast = "Уточняйте у менеджера";
            if (distance < 70) {
                coast = "2500 рублей";
            }
            if (distance < 50) {
                coast = "1000 рублей";
            }
            if (distance < 30) {
                coast = "Бесплатно";
            }
            $(".deliviry-cost .cost").html(coast + " (~" + distance + "км)");
        });
    }


    var timer = null;
    $("#coast_address").keyup(function () {
        var address = $(this).val();
        clearTimeout(timer);
        timer = setTimeout(function() {
            cost_adress_action_dilevery(address);
        }, 1000)
    });

});
// Include on ORDER PAGE !!!  /close

*/
// INCLUDE personal area page /start
"use strict";
function personal_area_zz_call() {
    function fragment(fragmentClass) {
        $(".fragments .active").removeClass("active");
        $("."+fragmentClass).addClass("active");
    }
    $(".personal-navigation .item-navigation").click(function() {
        var fragmentClass = $(this).attr("data");
        $(".personal-navigation .item-navigation").removeClass("active");
        $(this).addClass("active");
        fragment(fragmentClass);
    });
    $(".tax-system .item").click(function(){
        $(".tax-system .item").removeClass("current");
        $(this).addClass("current");
    });
    $(".open_tab").click(function() {
       $(".note-tab-content").removeClass("active");
       var c = $(this).closest(".note").find(".note-tab-content");
       c.addClass("active");
    });
};
// INCLUDE personal area page /close
// INCLUDE where good video /start
function paly_video_zz_call() {
    $(".play_video").click(function() {
        // Close old; codecs="avc1.42E01E, mp4a.40.2"
        $.each($(".video_view"), function(key, v){
            if( $(v).html() ) {
                var good_image_block = $(v).closest(".good_image_block").length ? $(v).closest(".good_image_block") : $(v).closest(".good_image");
                console.log("Old play...");
                var image = good_image_block.find("img");
                $(v).css({ "display":"none" });
                image.css({
                    "opacity":"1"
                });
                $(v).html("")
            }
        });
        var good_image_block = $(this).closest(".good_image_block").length ? $(this).closest(".good_image_block") : $(this).closest(".good_image");
        var video = good_image_block.find(".video_view");
        var image = good_image_block.find("img");
        image.css({
            "opacity":"0"
        });
        video.css({
            "display":"block",
            "width":good_image_block.width()+"px",
            "height":good_image_block.height()+"px"
        });

        // EMPTY VIDEO PATH
        var video_path = {"mp4":"video/videoplayback.mp4", "webm":"video/videoplayback.webm"};
        if(video.attr("data-video")) {
            var video_path = jQuery.parseJSON(video.attr("data-video"));
        }

        video.html( '<div class="close korsar-icon"></div>' +
                    '<video autoplay="autoplay" width="'+good_image_block.width()+'" height="'+good_image_block.height()+'" controls="controls" poster="'+image.attr("data-src")+'">'+
                        '<source src="'+video_path.mp4+'" type="video/mp4">'+ // Add more source...
                        '<source src="'+video_path.webm+'" type="video/webm">'+ // Add more source...
                        'Тег video не поддерживается вашим браузером.'+
                        '<a href="'+video_path.mp4+'">Скачайте видео</a>.'+
                    '</video>');

        video.find(".close").click(function() {
            video.css({ "display":"none" });
            image.css({
                "opacity":"1"
            });
            video.html(" ");
        });
    });
};
// INCLUDE where good video /close
var modal_complite = '<div class="korsar-modal js-action-form-was-send" style="display: block; opacity: 1;">\n' +
    '            <div class="wrap">\n' +
    '                <div class="modal-body" style="max-width:360px; height:420px">\n' +
    '                    <div class="close"><span class="korsar-icon close"></span></div>\n' +
    '                    <div class="header" style="margin-top:20px;margin-bottom:20px;"></div>\n' +
    '                    <div class="form-2"  style="text-align: center;">\n' +
    '                        <img style="width:80px;" src="/local/templates/pyrosalut/images/svg/check-2.svg">\n' +
    '                        <p>Спасибо</p><p>Cсылка на прайс-лист успешно отправлена на указанный e-mail. Пожалуйста, проверьте почту в течении нескольких минут.</p>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>';

var block_send = false;
var old_text = "";
function test_send_form(element) {

    var reachGoal = $(element).closest(".korsar-modal").attr('data-reachgoal');
    console.log("reachGoal:"+ reachGoal);
    var btn =  $(element);

    var form_1 = $(element).parent();
    name = "Без имени";



    if(check_form(form_1, "on-view")) {
        var name = form_1.find(".i-name").val();
        var phone = form_1.find(".i-phone").val();
        var email = form_1.find(".i-email").val();
        var point = form_1.find(".i-point").val();
        //showBlock_2(name);


        block_send = false;
        form_1.find(".js-action-do-auth").html("Подождите, отправка...");

        if(block_send) {
            return false;
        }

        var old_text = btn.text();
        btn.text("Отправка...");

        $.ajax({
            type: "POST",
            url: "/local/ajax/hash_auth.php",
            data: JSON.stringify({name: name, email: email, phone: phone,city: point})
        }).done(function (data) {
            block_send = true;
            btn.text(old_text);

            form_1.find(".js-action-do-auth").html("Получить оптовы цены");
            if (data.length) {
                $(form_1).find(".error").remove();
                $.each(data, function (k, v) {
                    $(form_1).append('<div class="error red">' + v.error + '</div>');
                });
            } 
 
            if (data.code == "200" && data.error == "null") {
                $(".korsar-modal").animate({
                    opacity: 0
                }, 200, function () {
                    $(this).css({"display": "none"});
                }).removeClass("active");

                $("body").append(modal_complite);

                if (reachGoal) {
                    window.yaCounter51429325.reachGoal(reachGoal);
                } else {
                    window.yaCounter51429325.reachGoal('Lid-button');
                }
            }
        });
    }
}

/*
$("body").on("click", ".korsar-modal .js-action-do-auth", function(e){
    console.log("Check form !");
    test_send_form(this);
});
*/

function price_form_zz_call() {

    var modal = '<div class="korsar-modal js-action-open-price">'+
        '<div class="wrap">'+
        '<div class="modal-body" style="max-width:360px; height:480px">'+
        '<div class="close">'+
        '<span class="korsar-icon close"></span>'+
        '</div>'+
        '<div class="header" style="margin-top:20px;margin-bottom:0px;">Оформи заявку сейчас и получить <span class="red">скидку до 45%</span> !</div>'+
        '<div class="form">'+
        '<fieldset>'+
        '<span class="korsar-icon user-w"></span>'+
        '<input type="text" class="i-name korsar-input" placeholder="Имя"  data-pattern="notnull" required>'+
        '</fieldset>'+
        '<fieldset>'+
        '<span class="korsar-icon phone"></span>'+
        '<input type="text" class="i-phone korsar-input" placeholder="Телефон" data-pattern="phone" required>'+
        '</fieldset>'+
        '<fieldset>'+
        '<span class="korsar-icon mail"></span>'+
        '<input type="text" class="i-email korsar-input" placeholder="Email" data-pattern="email" required>'+
        '</fieldset>'+
        '<fieldset>'+
        '<span class="korsar-icon point"></span>'+
        '<input type="text" class="i-point korsar-input" placeholder="Город" data-pattern="notnull" required>'+
        '</fieldset>'+
        '<button type="button" class="js-action-do-auth button green active" onclick="test_send_form(this)">Получить прайс-лист</button>'+
        '<fieldset class="checkbox" style="padding-top: 21px;">' +
        '<span class="checkbox">' +
        '<span class="korsar-icon check">' +
        '</span>' +
        '</span> ' +
        '<label style="font-size: 9px;">Согласен(а) с <a href="/personal/personal-data-policy/">политикой конфиденциальности</a></label>' +
        '<input type="hidden"></fieldset>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>';

    $("body").append(modal);
};
window.dataLayer = window.dataLayer || [];
// Include on HEADER !!!  /open
function start_zz_call() {
    $('body').on("click", '.auth-link', function (e) {
        console.log("Alert !!!");
    });

    // Mobile click or select
    $(".mobile-499-800").on("touchstart mousedown", function() {
        window.yaCounter51429325.reachGoal('mob click 8 (499) 800-81-91');
    });

    $(".mobile-495-737").on("touchstart mousedown", function() {
        window.yaCounter51429325.reachGoal('mob click 8 (495) 737-81-91');
    });
    /*
           FILTER
    */
    // Filter check
    $(".filter-items").unbind("click").on("click", ".item", function(e) {
        e.preventDefault();

        if($(this).find("input[type=radio]").length) {
            $(this).closest(".filter-items").find(".current").removeClass("current");
            $(this).addClass("current");
        }

        if($(this).find("input[type=checkbox]").length) {
            var t =  $(this);

            t.toggleClass("current");

            var tc =  $(this).find("input[type=checkbox]");
            tc.prop("checked", !tc.is( ":checked" ));

            console.log(  smartFilter.click(tc) );

            smartFilter.click(tc);
        }
    });

    // Filter First check
    var is_checker_some = false;
    $(".filter-items .item").each(function(k,v) {
        var i = $(this).find("input");
        if(i.is(":checked")) {
            i.closest(".item").addClass("current");
            i.closest(".bx-filter-parameters-box").addClass("bx-active");
            is_checker_some = true;
        }
    });
    if(!is_checker_some) {
        $(".bx-filter-parameters-box:first").addClass("bx-active").find(".filter-items.items-vertical").addClass("bx-active");
    }
    /*
         /FILTER
   */


    /*
         Viewports filters & menu
   */
    // Block control viewports filters and menu on mobile
    var is_open = false;
    var is_open_filter = false;
    var last_scroll = $(window).scrollTop();

    // Filter open close function
    $(".filters-block-header .menu-btn-mobile-filters,.oreder-close-filter-block .menu-btn-mobile-filters").click(function(event) {
        event.preventDefault();
        var elem = $(".aside-filters");

        if(is_open) {
            elem.addClass("korsar-hide");
            is_open_filter = false;
        } else {
            elem.removeClass("korsar-hide");
            is_open_filter = true;
        }
        content_display();
    });

    // Menu open close function
    $(".menu-block-header .menu-btn-mobile, .menu-block-header .menu-close, .top-fixed-header .menu-btn-mobile")
    .click(function(event) {
        event.preventDefault();
        var elem = $(".menu-block-header .menu-items");

        if(is_open_filter) {
            is_open = !is_open;
            $(".aside-filters").addClass("korsar-hide");
            is_open_filter = false;
        }

        if(is_open) {
            elem.addClass("korsar-hide");
            setTimeout(function(){
                $(window).scrollTop(last_scroll);
            }, 100);

        } else {
            last_scroll = $(window).scrollTop();
            $(window).scrollTop(0);
            elem.removeClass("korsar-hide");
        }
        content_display();
    });


    function content_display() {
        var d = is_open ? "block" : "none";
        $(".content_closer").css({"display": d});
        $("footer").css({"display": d});
        is_open = !is_open;
    }
    /*
          /Viewports filters & menu
    */


    /*
         TOP FIXED VIEW & HIDE
   */
    $(window).scroll(function() {

        updateHeaderView();
    });

    function updateHeaderView() {
        //console.log($(window).scrollTop());
        var w = $(window).outerWidth();
        var is_mobile = (w < 1024) ? true : false;
        var offset = 160;
        if(w > 1023) {
            offset = 168 + 110;
        }
        if($(window).scrollTop() > offset) {
            if(is_mobile) {
                $(".top-fixed-header .mobile").css({"display": "block", "opacity": "1"});
            } else {
                $(".top-fixed-header .desctop").css({"display": "block", "opacity": "1"});
            }
        } else {
            $(".top-fixed-header .mobile, .top-fixed-header .desctop").css({"display": "none", "opacity": "0"});
        }
    }

    updateHeaderView();
    /*
         /TOP FIXED VIEW & HIDE
   */


    // CATALOG IMAGE
    $(".catalog-block .good_image img").each(function(k, img) {
        var img = $(img).closest(".good_image");
        var w = img.width();
        var h = (w * 0.596); // 500:298
        if(w < 1024) {
            h = h + 30;
        }
        img.height(h);
    });

    // SELECT OPEN SELECT CLOSE
    $("fieldset.select").focusin(function(){
        $(this).find(".options").css({"display":"block"});
    });
    $("fieldset.select .option").click(function(){
        var val = $(this).html();
        $(this).closest(".select").find("input").val(val);
        $(this).closest(".select").find(".options").css({"display":"none"});
    });

    $("fieldset .item").click(function(){
        $(this).closest("fieldset").find(".item.current").removeClass("current");
        $(this).addClass("current");
    });


    $("[data-tooltip]").each(function(k, e){
        var element = $(e);
        element.mouseover(function(){
            var w  = $(window).width();
            var offset = $(this).offset();
            $("body").append('<div class="tooltip">'+element.attr("data-tooltip")+'</div>');
            var t = $(".tooltip");
            if(w > (t.width() + offset.left)) {
                $(".tooltip").css({"left":(offset.left + 30) +"px", "top":(offset.top - (t.height() / 2)  )+"px"});
            } else {
                var ws = offset.left - (w - offset.left) + 10;
                $(".tooltip").css({"left":ws +"px", "top":(offset.top + $(this).height() + 10)+"px"});
            }

        });
        element.mouseout(function(element){
            $(".tooltip").remove();
        });
    });


    // UPLOAD FILE
    $('.attach-file').on(
        'dragover',
        function(e) {
            e.preventDefault();
            e.stopPropagation();
        }
    );
    $('.attach-file').on(
        'dragenter',
        function(e) {
            $(this).addClass("dragenter");
            e.preventDefault();
            e.stopPropagation();
        }
    );
    $('.attach-file').on(
        'dragleave',
        function(e) {
            $(this).removeClass("dragenter");
            e.preventDefault();
            e.stopPropagation();
        }
    )
    $('.attach-file').on(
        'drop',
        function(e){
            $(this).removeClass("dragenter");
            if(e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length) {
                e.preventDefault();
                e.stopPropagation();
                /*UPLOAD FILES HERE*/
                handleFiles(e.originalEvent.dataTransfer.files,  $(this));
            }
        }
    );
    $('.attach-file').on(
        'click',
        function(e){
            e.preventDefault();
            e.stopPropagation();
            $(this).find('input[type=file]').trigger('click');
        }
    );

    $('.attach-file input[type=file]').on('click', function(e){
        e.stopPropagation();
    });

    $('.attach-file input[type=file]').on('change', function(e){
        console.log($(this).files);
        e.preventDefault();
        e.stopPropagation();
        /*UPLOAD FILES HERE*/
        handleFiles(e.target.files, $(this).parent());
    });

    function handleFiles(files, obj) {
        var text = $(obj).find(".text");
        var input = $(obj).find('input[type=file]');
        input.files = files;
        if(files.length >= 1) {
            if(files.length == 1) {
                text.html(files[0].name);
            } else {
                text.html("Прикреплено файлов:" + files.length);
            }
        } else {
            text.html("+ Прикрепите файл при необходимости");
        }
    }


    $(".menu-back-link").click(function(){
        parent.history.back();
        return false;
    });


    $().ready(function() {
        var tap = "first";
        $(".oreder-close-filter-block a").on('touchstart click', function(event) {
            event.preventDefault();
            if(tap === "second") {
                window.location.href = $(this).attr("data-href");
            }
            if(tap === "first") {
                tap = "second"
                $(this).closest(".order").addClass("tap-first");
            }

        });
    });



    /*
        MAIN PAGE SLIDER REVIEW
    */
    $('#js-target-main-review-slider').slick({
        infinite: false,
        speed: 300,
        slidesToShow: 2,
        slidesToScroll: 2,
        adaptiveHeight: true,
        dots: false,
        lazyLoad: 'ondemand',
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });


    /*
        PRODUCTS SLIDER
    */
    $('.js-target-slider-goods').slick({
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 4,
        adaptiveHeight: true,
        dots: false,
        lazyLoad: 'ondemand',
        responsive: [
            {
                breakpoint: 1440,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            }, {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

};

// Include on HEADER !!! /close


// INCLUDE where silder set or anyway / start
function swipe_slider_zz_call() {
    $(".swipe_slider").each(function(k, v) {
        var debug = false;
        var slider = $(v);
        var window_width = $(document).width();
        console.log("Update");
        var attr = slider.attr('data-slider');
        var data_slider = {};
        if (attr) {
            data_slider = jQuery.parseJSON(attr);
        }
        var sw_lr_padding = data_slider.sw_lr_padding ? data_slider.sw_lr_padding : 20;
        slider.css({"padding-left": sw_lr_padding, "padding-right": sw_lr_padding});
        var dots_control = data_slider.dots_control ? data_slider.dots_control : false;
        var dots_class = data_slider.dots_class ? data_slider.dots_class : "";

        var swipe_error = data_slider.swipe_error ? data_slider.swipe_error : 50;
        var arrow_control = data_slider.arrow_control ? data_slider.arrow_control : 0;
        var arrow_control_view = data_slider.arrow_control_view ? data_slider.arrow_control_view : 0;
        var arrow_dropshadow = data_slider.arrow_dropshadow ? data_slider.arrow_dropshadow : false;

        var full_width_touch_slider = data_slider.full_width_touch_slider ? data_slider.full_width_touch_slider : 0;
        var good_image_load_control = data_slider.good_image_load_control ? data_slider.good_image_load_control : false;

        var l_padding = data_slider.l_padding ? data_slider.l_padding : 0;

        var image_height_control = data_slider.image_height_control ? data_slider.image_height_control : false;
        /* SLIDES DISPLAYD */
        var slides_dispayd = data_slider.slides_dispayd ? data_slider.slides_dispayd : 1;
        var multiplicity_slides = data_slider.multiplicity_slides ? data_slider.multiplicity_slides : {
            320: 1,
            375: 2,
            1024: 3,
            1170: 4
        }
        $.each(multiplicity_slides, function (key, value) {
            if (window_width >= key) {
                slides_dispayd = value;
            }
        });

        var count_slide = slider.find('.slide').length;
        slider.css({"overflow":"hidden"});

        var auto_slide_move = data_slider.auto_slide_move ? data_slider.auto_slide_move : false;
        var is_toush_slide = false;

        if(full_width_touch_slider > window_width && full_width_touch_slider != 0) {
            l_padding += (slider.find(".slides-wrap").width() / slides_dispayd) * 0.3;
            /* Изменение padding to full width */
            slider.css({"padding-left": 0, "padding-right": 0, "margin-left":"-20px", "margin-right":"-20px", "width":window_width+"px"});

        }
        //console.log([full_width_touch_slider,window_width,slides_dispayd,l_padding]);

        var w = (slider.find(".slides-wrap").width() / slides_dispayd - l_padding); // Slider width

        var max_slide_height = data_slider.max_slide_height ? data_slider.max_slide_height : 200;
        var slides_margin = 0;
        var max_slides_margin = count_slide * w;
        var slide_view = 0;

        function addDots() {
            /* DOTS */
            if (dots_control) {
                slider.find('.dots').remove();
                slider.append("<div class='dots "+dots_class+"'></div>");
                var areas = slideSAreaCount();
                for (var i = 0; areas > i; i++) {
                    slider.find(".dots").append("<div class='dot' data-goto='" + (i + 1) + "'></div>");
                }
                // centred
                slider.find(".dots").css({"left": ((slider.find(".slides-wrap").width() - slider.find(".dots").width()) / 2) + "px"});
                slider.find(".dots .dot:eq(0)").addClass('current');
                /* DOTS CONTROL */
                slider.find('.dots').on('click', '.dot', function (e) {
                    var vector = 0;
                    var goto_num = parseInt($(this).attr('data-goto'));
                    vector = ((slide_view + goto_num) - 1) * -1;
                    moveSlide(vector);
                });

            }
        }

        function adaptive_slider() {
            w = (slider.find(".slides-wrap").width() / slides_dispayd - l_padding);
            max_slides_margin = count_slide * w;

            if(arrow_dropshadow) {
                slider.find(".previous ").addClass("arrow_dropshadow");
                slider.find(".next ").addClass("arrow_dropshadow");
            }

            /* ARROWS */
            if (!arrow_control || arrow_control_view > window_width) {
                slider.find(".previous ").hide().addClass("forever_disabled");
                slider.find(".next ").hide().addClass("forever_disabled");
            }
            addDots();
        }
        adaptive_slider();

        /* WIDTH & POSITION LEFT */
        function resize_slides(width, resizeImage) {
            var slide_step = 0;

            slider.css({"height":"auto"});
            slider.find(".slide").css({"height":"auto"});
            slider.find(".slides").css({"height":"auto"});

            slider.find('.slide').each(function (key, slide) {
                $(slide).width(width);
                $(slide).css({'left': (slide_step * width) + "px"});
                max_slide_height = (max_slide_height < $(slide).height()) ? $(slide).height() : max_slide_height;
                //console.log(slide, max_slide_height);
                slide_step++;
            });

            slider.css({"height":max_slide_height+"px"});
            slider.find(".slide").css({"height":max_slide_height+"px"});
            slider.find(".slides").css({"height":max_slide_height+"px"});


            var ph = slider.find(".previous").height();
            var control_h = max_slide_height / 2 - (ph / 2);
            slider.find(".previous").css({"top": control_h + "px"});
            slider.find(".next").css({"top": control_h + "px"});

            addDots();
        }
        // Init call
        if(!image_height_control) {
            resize_slides(w, false);
        }
        slider.find("img").bind("load", function () {
            resize_slides(w, true);
            $(this).css({"opacity":1});
        });

        // Control event
        slider.find(".previous").click(function () {
            if (!$(this).hasClass('disabled')) {
                moveSlide(slides_dispayd);
                is_toush_slide = true;
            }
        });
        slider.find(".next").click(function () {
            if (!$(this).hasClass('disabled')) {
                moveSlide(slides_dispayd * -1);
                is_toush_slide = true;
            }
        });

        // Control swipe
        var start_x;
        var stop_x;
        var start_margin = 0;
        var max_margin_swipe = (max_slides_margin - (w * slides_dispayd)) * -1;
        var allowed_touch_derection = {'next': true, 'previous': true};

        slider.find('.slide').bind('touchstart', function (e) {
            start_margin = parseInt(slider.find('.slides').css("margin-left"));
            start_x = e.originalEvent.touches[0].pageX;
        });
        slider.find('.slide').bind('touchmove', function (e) {
            if(full_width_touch_slider != 0) {
                var move =  start_x - e.originalEvent.touches[0].pageX;
                moveSlideOnPX(move);
            }
        });
        slider.find('.slide').bind('touchend', function (e) {
            if(full_width_touch_slider == 0) {
                stop_x = e.originalEvent.changedTouches[0].clientX;
                if (start_x !== stop_x) {
                    var  condition = "";

                    if ((start_x + swipe_error) < (stop_x - swipe_error)) {
                        condition = "previous " + (start_x - swipe_error) + "<" + (stop_x + swipe_error);
                        if (allowed_touch_derection.previous) {
                            moveSlide(slides_dispayd);
                            is_toush_slide = true;
                        };
                    }

                    if ((start_x - swipe_error) > (stop_x + swipe_error)) {
                        condition = "next " +(start_x - swipe_error) + ">" + (stop_x + swipe_error);
                        if (allowed_touch_derection.next) {
                            moveSlide(slides_dispayd * -1);
                            is_toush_slide = true;
                        };
                    }

                    if (debug) {
                        console.log({
                            start_x: start_x,
                            start_x_e:start_x - swipe_error,
                            stop_x: stop_x,
                            stop_x_e:stop_x + swipe_error,
                            condition:condition
                        });
                    };
                }
            }
        });

        /* OPEN SLIDE */
        var last_max_width = max_slide_height;
        var last_text_block_height = 0;
        slider.find('.readmore').bind('click', function(e) {
            if(!$(this).hasClass("text-block-open")) {
                var slide = $(this).closest(".slide");
                var text = slide.find(".review-text-wrap");
                var last_text_block_height = text.height();
                text.css({"height":"auto"});
                var open_text_block_height = text.height();
                text.css({"height":open_text_block_height+"px"});
                last_max_width = max_slide_height;
                var new_slide_height = open_text_block_height - last_text_block_height + last_max_width;
                slider.css({"height":new_slide_height+"px"});
                slide.css({"height":new_slide_height+"px"});
                slider.find(".slides").css({"height":new_slide_height+"px"});
                $(this).html("Свернуть");
                $(this).addClass("text-block-open");
            } else {
                closeReadmore();
            }
        });

        function closeReadmore() {
            slider.find(".slide .review-text-wrap").attr("style", "");
            slider.css({"height":last_max_width+"px"});
            slider.find(".slide").css({"height":last_max_width+"px"});
            slider.find(".slides").css({"height":last_max_width+"px"});
            slider.find(".readmore").html("Читать дальше").removeClass('text-block-open');
        }

        function moveSlide(slide_derection) {
            // slides_dispayd
            slide_view += slide_derection;
            var slide_margin_pre = slide_view * w;

            // Detect max margin
            if ((max_slides_margin * -1) >= (slide_margin_pre - w * slides_dispayd)) {
                slider.find(".next").addClass('disabled').hide();
                allowed_touch_derection.next = false;
            } else {
                slider.find(".next").removeClass('disabled').show();
                allowed_touch_derection.next = true;
            }

            // Detect min margin
            if (0 === slide_margin_pre) {
                slider.find(".previous").addClass('disabled').hide();
                allowed_touch_derection.previous = false;
            } else {
                slider.find(".previous").removeClass('disabled').show();
                allowed_touch_derection.previous = true;
            }

            slides_margin = slide_margin_pre;
            slider.find('.slides').css({'margin-left': slides_margin + "px"});
            var s = (slide_view * -1) + 1;
            slider.find('.dots .dot').removeClass("current");
            slider.find('.dots .dot:nth-child(' + s + ')').addClass("current");

            if (debug) {
                console.log({
                    slide_derection: slide_derection,
                    slide_view: slide_view,
                    allowed_touch_derection: allowed_touch_derection,
                    max_slides_margin: max_slides_margin,
                    slide_margin_pre: slide_margin_pre,
                    slides_margin: slides_margin,
                    slides_dispayd: slides_dispayd,
                    w: w,
                    s: s
                })
            };
        }

        function moveSlideOnPX(addPixels) {
            var new_margin = (start_margin-addPixels);
            if(new_margin <= 0 && max_margin_swipe <= new_margin) {
                slider.find('.slides').css({'margin-left': (start_margin-addPixels) + "px"});
            }
        }

        // Single shot
        moveSlide(0);

        // рассчитывем количество слайдов
        function slideSAreaCount() {
            var count = 0;
            count = Math.ceil(count_slide / slides_dispayd);
            return count;
        }

        var revers = false;
        var timeout_var = null;
        function autoSlide() {
            console.log(is_toush_slide);
            if(!is_toush_slide) {
                timeout_var = setTimeout(function(){
                    if((slide_view*-1)+1 < count_slide && !revers) {
                        //console.log("Prepare move...", (slide_view*-1)+1, count_slide, revers);
                        //console.log("Move...");
                        if(!is_toush_slide) {
                            moveSlide(slides_dispayd * -1);
                        }
                        autoSlide();
                    } else {
                        revers = true;
                    }

                    if((slide_view*-1) > 0 && revers) {
                        //console.log("Prepare move...", (slide_view*-1), 0, revers);
                        //console.log("Move revers...");
                        moveSlide(slides_dispayd);
                        autoSlide();
                        if((slide_view*-1) == 0) {
                            revers = false;
                        }
                    } else {
                        revers = false;
                    }
                }, auto_slide_move)
            } else {
                console.log("Auto start");
                clearTimeout(timeout_var);
                timeout_var = setTimeout(function(){
                    is_toush_slide = false;
                    autoSlide();
                },auto_slide_move * 10);
            }
        }

        if(auto_slide_move > 0) {
            autoSlide();
        }

    });
};
// INCLUDE where silder set or anyway /close
function add_to_cart_YE(good) {
    dataLayer.push({
        "ecommerce": {
            "add": {
                "products": [
                    {
                        "id": good.id,
                        "name": good.name,
                        "price": good.price,
                        "category": good.category,
                        "quantity": good.quantity
                    }
                ]
            }
        }
    });
}


function view_product_YE(good) {
    dataLayer.push({
        "ecommerce": {
            "detail": {
                "products": [
                    {
                        "id": good.id,
                        "name": good.name,
                        "price": good.price,
                        "category": good.category,
                    }
                ]
            }
        }
    });
}

function remove_from_cart_YE(good) {
    dataLayer.push({
        "ecommerce": {
            "remove": {
                "products": [
                    {
                        "id": good.id,
                        "name": good.name,
                        "price": good.price,
                        "category": good.category,
                    }
                ]
            }
        }
    });
}



function remove_from_cart_YE(purchase, goods) {
    dataLayer.push({
        "ecommerce": {
            "purchase": {
                "actionField": {
                    "id" : purchases
                },
                "products": goods
            }
        }
    });
}
"use strict";
$().ready(function(){
    catalog_zz_call();
    swipe_slider_zz_call();
    start_zz_call();
    paly_video_zz_call();
    personal_area_zz_call();
    menu_zz_call();
    login_zz_call();
    cart_zz_call();
    time_counter_zz_call();
    modal_zz_call();
    loader_zz_call();
    price_form_zz_call();

    zz_auth_modal();

    delivery_tab();
});
function catalog_zz_call(){
    var l = $(".catalog .catalog-block .goods .good").length;
    if (l % 2 !== 0) {
        $(".catalog .catalog-block .goods").addClass("odd");
    } else {
        $(".catalog .catalog-block .goods").addClass("even");
    }
};
function loader_zz_call() {
    $('.background_lizy_load').css({
        "opacity": 0,
        "transition": "all 0.4s"
    });
    $('.background_lizy_load').on('inview', function (event) {
        var element = $(this);
        $(element).css({
            "background-image": "url("+$(element).attr('data-src')+")",
            "opacity":1
        });
    });

    $('img.lizy_load').css({
        "transition": "all 0.4s",
        "opacity": 0,
    }).closest(".img_with_sadow").find(".shadow").css({
        "transition": "all 1s",
        "opacity": 0,
    });
    $('img.lizy_load').on('inview', function (event) {
        var element = $(this);
        $(element).attr({
            "src": $(element).attr('data-src')
        });
        $(element).imageready( function() {
            $(element).css({"opacity":"1"}).closest(".img_with_sadow").find(".shadow").css({"opacity": 1,});
        });
    });
};
function modal_zz_call(){

    $(".call-modal").unbind('click').on('click', function(e) {
        e.preventDefault();
        var d = $(this).attr('data-target');
        var datareachgoal = $(this).attr('data-reachgoal');
        if(datareachgoal) {
            $(d).attr('data-reachgoal', datareachgoal);
        }
        $(d).css({"display":"block"}).animate({
            opacity: 1
        },200);
        return false;
    });

    $("body").unbind('click').on("click", ".korsar-modal .close", function(e) {
        e.preventDefault();
        var v  = $(this).closest(".korsar-modal").find("video");
        $.each(v, function(k, v){
            v.pause();
        });
        $(this).closest(".korsar-modal").animate({
            opacity: 0
        },200, function(){
            $(this).css({"display":"none"});
        });
        return false;
    });
};
function time_counter_zz_call(){
    $(".time-counter").each(function(key, counter){

        var c = $(counter);
        var deathline = c.attr("data-deathline");
        var days_offset = c.attr("data-days") ? c.attr("data-days") : 1 ;

        var newtime =  getTimeRemaining(deathline);
        c.find(".days span").html(days_offset - 1); 
        c.find(".hours span").html(newtime.hours);
        c.find(".minutes span").html(newtime.minutes);
        c.find(".seconds span").html(newtime.seconds);

        var theDaysBox  = c.find(".days span");
        var theHoursBox = c.find(".hours span");
        var theMinsBox  = c.find(".minutes span");
        var theSecsBox  = c.find(".seconds span");


        var refreshId = setInterval(function() {

            var currentSeconds = theSecsBox.text();
            var currentMins    = theMinsBox.text();
            var currentHours   = theHoursBox.text();
            var currentDays    = theDaysBox.text();

            if(currentSeconds == 0 && currentMins == 0 && currentHours == 0 && currentDays == 0) {
                // if everything rusn out our timer is done!!
                // do some exciting code in here when your countdown timer finishes
                currentDays = days_offset;
            }

            if(currentSeconds == 0 && currentMins == 0 && currentHours == 0) {
                // if the seconds and minutes and hours run out we subtract 1 day
                theDaysBox.html(currentDays-1);
                theHoursBox.html("23");
                theMinsBox.html("59");
                theSecsBox.html("59");
            } else if(currentSeconds == 0 && currentMins == 0) {
                // if the seconds and minutes run out we need to subtract 1 hour
                theHoursBox.html(addZerro(currentHours-1));
                theMinsBox.html("59");
                theSecsBox.html("59");
            } else if(currentSeconds == 0) {
                // if the seconds run out we need to subtract 1 minute
                theMinsBox.html(addZerro(currentMins-1));
                theSecsBox.html("59");
            } else {
                theSecsBox.html(addZerro(currentSeconds-1));
            }
            c.css({"display":"block"});
        }, 1000);


    });

    function addZerro(int_val) {
        if(int_val > 9) {
            return "" + int_val;
        }
        return "0" + int_val;
    }


    function getTimeRemaining(endtime){
        var t = Date.parse(endtime) - Date.parse(new Date());
        var seconds = Math.floor( (t/1000) % 60 );
        var minutes = Math.floor( (t/1000/60) % 60 );
        var hours = Math.floor( (t/(1000*60*60)) % 24 );
        var days = Math.floor( t/(1000*60*60*24) );
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }
};