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