// include where
function cart_zz_call() {
    var debug = true;
    var url = "/local/ajax/add2basket_v2.php";

    /*
        В корзине блок заливает
    */
    var mass_container = $(".mass-volume");
    if (mass_container) {
        mass_container.find(".mass").html(hms(mass_container.find(".mass").html()));
        mass_container.find(".volume").html(hms(mass_container.find(".volume").html()));
        if (window.innerWidth >= 1024) {
            $(".info-wrapper").stick_in_parent({offset_top: 80});
            $("#bx-soa-total").stick_in_parent({offset_top: 100});
        }
        if (window.innerWidth >= 1170) {
            $(".cart-v2-wrapper .info").stick_in_parent({offset_top: 80});
        }
    }

    /*
        Выбор множетиля
    */
    $('.good .good_prices_mode, .good-v2 .good-v2__prices, #scroll-modal__item-count .item-count__price, ' +
        '#scroll-modal__item-count-good .item-count__price')
        .on("click", ".flex-row-price, .good-v2__price-row", function () {
            var row = $(this);

            var dataMultiplicity = row.attr("data-multiplicity");

            if (dataMultiplicity > 0) {
                row.parent().find(".current, .good-v2__price-rwo_current")
                    .removeClass("current")
                    .removeClass("good-v2__price-rwo_current");

                row.addClass("current").addClass("good-v2__price-rwo_current");
                var input = false;


                if (window.innerWidth < 768) {
                    var modal = row.closest(".modal");
                    if (modal.length !== 0) {
                        input = modal.find(".item-count__count").find("input");
                        console.log(modal, input);
                    }
                }

                var good = row.closest(".good");
                if (good.length !== 0 && !input) {
                    input = good.find("input");
                    //console.log(good, input);
                }

                var goodv2 = row.closest(".good-v2");
                if (goodv2.length !== 0 && !input) {
                    input = goodv2.find("input");
                    //console.log(goodv2, input);
                }


                multiplicity = getMultiplicity(row);

                if (input) {
                    if (input.val() < multiplicity) {
                        input.val(multiplicity);

                    }
                    updateCartOnInputChange(input);
                } else {
                    console.log(good, modal, goodv2);
                }
            }
        });

    /**
     * Получить множитель товарной единицы
     * @param {Element} btn - целевая кнопка добавить в корзину
     * @returns {number}
     */
    function getMultiplicity(btn) {
        var multiplicity = 1;

        var good = btn.closest(".good");
        if (good.length !== 0) {
            multiplicity = good.find(".good_prices_mode .current").attr("data-multiplicity");
        }

        var goodv2 = btn.closest(".good-v2");
        if (goodv2.length !== 0) {
            multiplicity = goodv2.find(".good-v2__prices .good-v2__price-rwo_current").attr("data-multiplicity");
        }

        if (window.innerWidth < 768) {
            //var modal = btn.closest("#scroll-modal__item-count");
            var modal = btn.closest(".modal");
            if (modal.length !== 0) {
                multiplicity = modal.find(".item-count__price .good-v2__price-row.good-v2__price-rwo_current").attr("data-multiplicity");
            }
        }

        if (!parseInt(multiplicity)) {
            multiplicity = 1;
        }

        return parseInt(multiplicity);
    }

    /**
     * Преобразовывает в читабельный формат с пробелами число 1000 -> 1 000
     * @param {Number} x - число
     * @returns {string}
     */
    function numberWithSpaces(x) {
        if (x) {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            return parts.join(".");
        }
    }

    /**
     * Обновляет модальное окно выбора количества товара для мобильной версии
     * @param {Element} $modal - модальное окно на странице
     * @param {Element} $button - целевая кнопка, нажатая
     */
    function modalUpdateText($modal, $button) {
        var container = $button.closest(".good");
        console.log(container);
        if (!container.length)
            return;

        var price = container.find(".mobile_price").text().replace(/\s+/g, '');

        var d = {
            price: parseFloat(price),
            name: container.find(".good_name a").text(),
            images: container.find(".good_image > a").find("img").attr("src"),
            sku: container.find(".good_code .sku").text(),
            id: $button.attr("data-product-id"),
            gpm: container.find(".good_prices_mode").html(),
            max: parseFloat(container.find(".btn-block").find("input").attr("max")),
            count: container.find(".good_name_price_block .count").attr("data-q"),
            mesure: container.find(".good_name_price_block .count").attr("data-qmesure")
        };

        $modal.find("#good-image").attr({"src": d.images});
        $modal.find("#good-name").html(d.name);
        $modal.find("#good-sku").html(d.sku);
        $modal.find("#good-prices").html(d.gpm);
        $modal.find("#good-input").attr({"max": d.max}).attr({"data-product-id": d.id}).val(1);
        $modal.find("#good-sum").attr({"data-price": d.price}).html(numberWithSpaces(d.price) + " ₽");


        $modal.find("#good-store").html("В наличии: " + numberWithSpaces(d.count) + " " + d.mesure);


        $modal.find(".mobile_price").remove();
        $modal.find(".flex-row-price").removeClass("flex-row-price").addClass("good-v2__price-row").find("span").addClass("good-v2__price-col");
        $modal.find("#good-prices").find(".current").addClass("good-v2__price-rwo_current");

        console.log(d);
    }

    /**
     * Обновляет сумму товаров: на странице товара(старой версии), в модальном окне
     * @param {Number} quantity
     */
    function update_total_price(quantity) {

        //console.log("Q:", quantity);
        var sum = $(".good_content .good_offer .total_good_sum_block");
        if (sum.html()) {
            var price = sum.attr('data-price');
            price = parseInt(price, 10);
            sum.html(numberWithSpaces(price * quantity) + " ₽");
        }

        sum = $(".good-v2 .good-v2__count-sum .good-v2__count-sum-value");
        if (sum) {
            var price = parseInt(sum.attr('data-price'), 10);
            sum.html(numberWithSpaces(price * quantity) + " ₽");
        }

        sum = $("#scroll-modal__item-count .good-v2__count-sum .good-v2__count-sum-value");
        if (sum) {
            var price = parseInt(sum.attr('data-price'), 10);
            sum.html(numberWithSpaces(price * quantity) + " ₽");
        }

    }

    /**
     * Хендлер изменения инпута количества товаров в ОСНОВНОЙ корзине
     * @param {Number} $input
     */
    function updateMainCartOnInputChange($input) {

        var quantity = $input.val();
        var ID = $input.attr("data-product-id");

        if (quantity >= 1) {
            to_cart("update", ID, quantity, function (data) {
                update_mini_cart(data.price, data.count_item);
                update_cart(data);
                checkOrderDisable(data.base_price);
            });
        } else {
            var container = $input.closest(".good");
            container.css({"opacity": "0"});
            to_cart("delete", ID, quantity, function (data) {
                update_mini_cart(data.price, data.count_item);
                update_cart(data);
                checkOrderDisable(data.base_price);
                container.remove();
            });

        }
    }

    // Обновление основной корзины по инпуту
    $('.good input').change(function () {
        updateMainCartOnInputChange($(this));
    });

    // Удаляем из основной корзины
    $('.good .remove').click(function () {
        var button = $(this);
        var container = $(this).closest(".good");
        var ID = button.find("a").attr("data-product-id");
        if (!ID) {
            ID = button.attr("data-product-id");
        }

        var bv = button.parent().find("input").val();
        var quantity = bv ? bv : 1;

        container.css({"opacity": "0"});

        to_cart("delete", ID, quantity, function (data) {
            // TODO Делать удалить товар
            update_mini_cart(data.price, data.count_item);
            update_cart(data);
            checkOrderDisable(data.base_price);
            container.remove();
        });
    });


    /**
     * ендлер изменения инпута количества у товаров
     * @param $input
     */
    function updateCartOnInputChange($input) {
        var quantity = parseInt($input.val());

        var max_quantity = parseInt($input.attr('max'));
        if (!max_quantity) {
            max_quantity = 9999999;
        }

        var min_quantity = 1;
        console.log("updateCartOnInputChange: ", quantity);
        $parent = $input.parent();
        $increment = $parent.find(".increment");
        $decrement = $parent.find(".decrement");

        $increment.removeClass('disabled');
        $decrement.removeClass('disabled');

        if (quantity >= max_quantity) {
            quantity = max_quantity;
            $input.val(quantity);
            $increment.addClass('disabled');
            $decrement.removeClass('disabled');
        }

        if (quantity <= min_quantity) {
            quantity = min_quantity;
            $input.val(quantity);
            $increment.removeClass('disabled');
            $decrement.addClass('disabled');
        }

        if (quantity <= max_quantity && quantity >= min_quantity) {
            update_total_price(quantity);
        }
    }


    update_total_price(1);


    var cart = [];

    //  #scroll-modal__item-count .increment
    $('.good_quantity_block .increment, .add-control .increment').click(function () {
        console.log('Click');
        var input = $(this).parent().find("input");
        var quantity = parseInt(input.val());
        var multiplicity = getMultiplicity($(this));

        var max_quantity = parseInt(input.attr('max'));
        if (!max_quantity) {
            max_quantity = 9999999;
        }

        if (quantity < max_quantity) {

            if (quantity < multiplicity && multiplicity != 1) {
                quantity = multiplicity;
            } else {
                quantity = parseInt(quantity) + parseInt(multiplicity);
            }

            input.val(quantity);
            if (quantity > 1) { // Включаем убавление
                $(this).parent().find(".decrement").removeClass('disabled');
            }
            update_total_price(quantity);
        }

        if (quantity >= max_quantity) {
            $(this).parent().find(".increment").addClass('disabled');
        }
    });
    // #scroll-modal__item-count .decrement
    $('.good_quantity_block .decrement, .add-control .decrement').click(function () {
        if ($(this).closest(".good_quantity_block").is(".disabled")) {
            return false;
        }

        var quantity = $(this).parent().find("input").val();
        var max_quantity = $(this).parent().find("input").attr('max');
        var multiplicity = getMultiplicity($(this));

        if (!max_quantity) {
            max_quantity = 9999999;
        }

        quantity = quantity - multiplicity;
        if (quantity <= 0) {
            quantity = 1;
        }

        if (quantity < max_quantity) { // Включаем прибавление
            $(this).parent().find(".increment").removeClass('disabled');
        }

        if (!$(this).hasClass('disabled')) {
            $(this).parent().find("input").val(quantity);
            if (quantity === 1) {
                $(this).addClass('disabled');
            }
        }

        if (quantity > 0) {
            update_total_price(quantity);
        }
    });


    $('.good_quantity_block input, #scroll-modal__item-count .item-count__count input, #scroll-modal__item-count-good .item-count__count input').change(function () {
        updateCartOnInputChange($(this));
    });

    $('.add_to_cart_block .add_button, .js-target-add-to-cart-good-v2').click(function () {
        var button = $(this);
        var bt_text = button.text();
        var $modal = $(button.attr("data-modal"));

        if (!button.is(".error") && !button.is(".disabled")) {
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
                            update_mini_cart(data.price, data.count_item);
                            button.html("ДОБАВЛЕНО");

                            modalUpdateText($modal, button);

                            if (window.innerWidth < 768) {
                                var scrollBarWidth = window.innerWidth - document.body.offsetWidth;
                                $('body').css('margin-right', scrollBarWidth).addClass('showing-modal');

                                $modal.show();
                            } else {
                                add_to_cart_message(button);
                            }

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
                                button.html(bt_text).addClass("active");
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

    $('.page-cart .add-control, .cart-v2-wrapper .btn-block').each(function (k, v) {
        var quantity = $(this).find("input").val();
        if (quantity > 1) {
            $(this).find(".decrement").removeClass('disabled');
        }
    });


    $('.page-cart .add-control .increment, .cart-v2-wrapper .btn-block .increment, #scroll-modal__item-count .increment, #scroll-modal__item-count-good .increment')
        .unbind('click').click(function () {
        var quantity = $(this).parent().find("input").val();
        var multiplicity = getMultiplicity($(this));
        var ID = $(this).closest(".add-control").find(".count").attr("data-product-id");
        if (!ID) {
            ID = $(this).parent().find("input").attr("data-product-id");
        }

        if (quantity < multiplicity && multiplicity != 1) {
            quantity = multiplicity;
        } else {
            quantity = parseInt(quantity) + parseInt(multiplicity);
        }

        $(this).parent().find("input").val(quantity);
        if (quantity > 1) {
            $(this).parent().find(".decrement").removeClass('disabled');
        }
        to_cart("update", ID, quantity, function (data) {
            update_total_price(quantity);
            update_mini_cart(data.price, data.count_item);
            update_cart(data);
            checkOrderDisable(data.base_price);
        });
    });

    $('.page-cart .add-control .decrement, .cart-v2-wrapper .btn-block .decrement, #scroll-modal__item-count .decrement,  #scroll-modal__item-count-good .decrement')
        .unbind('click').click(function () {
        var quantity = $(this).parent().find("input").val();
        var multiplicity = getMultiplicity($(this));
        var ID = $(this).closest(".add-control").find(".count").attr("data-product-id");
        if (!ID) {
            ID = $(this).parent().find("input").attr("data-product-id");
        }

        quantity = quantity - multiplicity;
        if (quantity <= multiplicity) {
            quantity = multiplicity;
        }

        if (!$(this).hasClass('disabled')) {
            $(this).parent().find("input").val(quantity);

            if (quantity === multiplicity) {
                $(this).addClass('disabled');
            }

            to_cart("update", ID, quantity, function (data) {
                update_total_price(quantity);
                update_mini_cart(data.price, data.count_item);
                update_cart(data);
                checkOrderDisable(data.base_price);
            });
        }
    });

    function to_cart(action, good, quantity, callback) {
        var sessionId = BX.bitrix_sessid();

        var obj = {
            type: action,
            product_id: good
        };

        if (quantity) {
            obj.quantity = +quantity;
        }

        obj.sessid = sessionId;

        var jsonData = JSON.stringify(obj);


        $.ajax({
            url: url + "?sessid=" + sessionId,
            type: "POST",
            data: {sessid: sessionId, site_id: BX.message('SITE_ID'), jsonData: obj},
            success: function (data) {
                $.ajax({
                    url: url + "?sessid=" + sessionId,
                    type: "POST",
                    success: function (data) {
                        callback(data);
                    }
                });
            },
            error: function (data) {
                callback(data);
            }
        });
    }

    /**
     * Добавляет подарок
     * @param {Element} el - элемент вызова
     */
    function add_present(el) {
        var obj = {
            type: 'add',
            product_id: 10015,
            quantity: 1,
            precent: 'Y'
        }
        var jsonData = JSON.stringify(obj);
        $.post(url, jsonData, function (data) {
            window.location.reload(false);
        }).fail(function () {
            el.html("Ошибка, повторите.")
        });
    }

    $(".cart-v2-wrapper .present-add").click(function () {
        add_present(this);
    });


    function update_mini_cart(p, i) {
        if (!i) {
            p = 0;
        }
        if ($(document).width() < 1024) {
            if (i >= 100) {
                i = "+99";
            }
            $(".cart-btn .items-count").html(i);
        } else {
            $(".cart-btn .items-count").html(i + " <span class=\"items-name\">" + declOfNum(+i, ["тов.", "тов.", "тов."]) + "</span>");

        }
        $(".cart-btn .cart-sum").html(p);
        // console.log({i:i,p:p});
    }

    function checkOrderDisable(p) {
        p = p.replace(/\s/g, '');
        p = parseInt(p);
        if (p < -1) {
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
        $(".cart-v2-wrapper .sale_programm").html("-" + (data.profit_of_my_discount_programm ? data.profit_of_my_discount_programm : 0));

        $(".cart-specific .pair:first .value, .mass-volume .mass").html((data.weight ? hms(data.weight) : 0));
        $(".cart-specific .pair:last .value, .mass-volume .volume").html((data.size ? hms(data.size) : 0));

        var diskount_precents = data.diskount_precents ? "-" + data.diskount_precents + "% cкидкa" : "";

        $(".info-1 .sale-value").html(diskount_precents);
        $(".cart-v2-wrapper .discout_p").html(data.diskount_precents);

        $(".cart-v2-wrapper .count_items").html(data.count_item);

        setProgress($('#circle-delivery'), data.price, window.nowPriceToDelivery);
        setProgress($('#circle-moscowfree'), data.price, window.allowFreeShippingMoscow);

        // Каждый обновляем
        $(data.items).each(function (k, v) {
            var good = $(".cart-v2-wrapper .good-" + v.id);
            good.find(".price .price-normal, .price .price-sale").html(v.basket_price);
            good.find(".price .price-old").html(v.basket_price_base)
            good.find(".price .price-normal").html(v.basket_price);
            good.find(".total_good_sum_block .one_item_price").html(v.one_item_price);


            if (v.count > 1) {
                // console.log(true, v.count);
                good.find(".total_good_sum").css({"display": "none"});
                good.find(".total_good_sum.big").css({"display": "block"});
            } else {
                //console.log(false, v.count);
                good.find(".total_good_sum").css({"display": "none"});
                good.find(".total_good_sum:not(.big)").css({"display": "block"});
            }
        });


    }

    $(".info-wrapper .btn-block .button, .btn-block-desctop .button").click(function (e) {
        e.preventDefault();
        if (!$(this).hasClass("disabled")) {
            window.location = $(this).attr("href");
        } else {
            var e = $(this).parent().find(".cart-min-order-sum");
            for (var i = 0; i < 3; i++) {
                $(e).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
            }
        }
    });

    var is_message_show = false;
    var message_destroy_timer = null;

    function add_to_cart_message(obj) {
        var image_src = null;

        if (window.innerWidth >= 768) {
            return false;
        }

        image_src = $(obj).closest(".good").find(".good_image img.width-load-control").attr("src");
        if (!image_src) {
            image_src = $(obj).closest(".good_content").find(".good_image_block img").attr("src");
        }

        if (!image_src) {
            image_src = $(obj).closest(".good-v2").find(".good-v2__image img").attr("src");
        }

        if (is_message_show) {
            clearTimeout(message_destroy_timer);
            $("body").find(".message-add-to-cart").remove();
        }

        is_message_show = true;

        var output = '<div class="container-3-fixed message-add-to-cart">\n' +
            '    <a href="/personal/cart/"><div class="push-up">\n' +
            '        <div class="image" style="background-image:url(\'' + image_src + '\')"></div>\n' +
            '        <div class="text">Товар добавлен в корзину</div>\n' +
            '    </div></a>\n' +
            '</div>';
        $("body").append(output);
        $("body").find(".message-add-to-cart").fadeIn(200, function () {
        });


        message_destroy_timer = setTimeout(function () {
            $("body").find(".message-add-to-cart").fadeOut(200, function () {
                $(this).remove();
            });
            is_message_show = false;
        }, 1000);
    }

    function present_view(p) {
        p = p.toString().replace(" ", "");
        p = parseInt(p);


        console.log(p);
        if (p < 49900) {

            $(".cart-v2-wrapper .present .present-add").css({"display": "none"});
            $(".cart-v2-wrapper .present .present-add-show").html("До подарка осталось: " + (49900 - p) + " руб.").css({"display": "block"});
        } else {
            $(".cart-v2-wrapper .present .present-add").css({"display": "block"});
            $(".cart-v2-wrapper .present .present-add-show").css({"display": "none"});
        }
    }


    $('#circle-1').circleProgress({
        size: 40,
        value: 1,
        fill: "#08d04c",
        animationStartValue: 0
    });

    $('#circle-delivery').circleProgress({
        size: 40,
        value: 0,
        fill: "#F02626",
        animationStartValue:0
    });

    $('#circle-moscowfree').circleProgress({
        size: 40,
        value: 0,
        fill: "#F02626",
        animationStartValue:0
    });

    function setProgress(dc, price, maxPrice) {
        var attr = dc.attr('id');
        if(!price) {
            price = "0";
        }
        if(!window.prevDeliveryProgress[attr]) {
            window.prevDeliveryProgress[attr] = 0;
        }
        var delivery_progress = (100 / maxPrice) * parseFloat(price.replace(/\s/g, ''));
        var delivery_color = "#F02626";
        var delivery_class = "bad";
        dc.parent().parent().addClass(delivery_class);
        if(delivery_progress >= 100 ) {
            delivery_progress = 100;
            delivery_color = "#08d04c";
            dc.parent().parent().removeClass(delivery_class);
        }
        dc.circleProgress({
            value: delivery_progress / 100,
            fill:delivery_color,
            size: 40,
            animationStartValue: window.prevDeliveryProgress[attr]
        });
        window.prevDeliveryProgress[attr] = delivery_progress / 100;
    }

    window.prevDeliveryProgress = [];

    var startPrice = $(".cart-v2-wrapper .order_price_real").html();

    if(!startPrice) {
        startPrice = "0";
    }

    setProgress($('#circle-delivery'), startPrice, window.nowPriceToDelivery);
    setProgress($('#circle-moscowfree'), startPrice, window.allowFreeShippingMoscow);
}