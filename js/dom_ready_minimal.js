"use strict";
$().ready(function(){
    start_zz_call();
    menu_zz_call();
    modal_zz_call();
    loader_zz_call();
});
// INCLUDE HEADER /start
function menu_zz_call() {
    var debug = false;
    var is_open = false;

    var win_w = window.innerWidth;
    var max_item = 9;
    var item_interator = 0;
    var tail_element = false;
    var count_elements = $(".menu-block-wrap .menu-block > .menu-item").length;
    var h_plus = 37;
    if( count_elements > max_item ) {
        if (win_w > 1024) {
            $(".menu-block-wrap .menu-block > .menu-item").each(function (k, v) {
                item_interator++;
                if (item_interator === max_item) {
                    $(".menu-block-wrap .menu-block").css({
                        "padding-left": "20px",
                        "padding-right": "20px"
                    });
                    $(v).find(".dropshadow").remove();
                    tail_element = $(v);

                    if (tail_element.find(".menu-level-2").length === 0) {
                        console.log("Append");
                        tail_element.append("<div class='menu-level-2'></div>");
                    } else {
                        console.log(tail_element.find(".menu-level-2"));
                    }
                }
                if (item_interator > max_item) {
                    tail_element.addClass("tail");
                    $(v).find(".menu-level-2").remove();
                    tail_element.find(".dropshadow").remove();
                    tail_element.find(".menu-level-2").append($(v));
                }
            });
        }
        if (win_w > 1170) {
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
                item.css({"margin-bottom": -1 * (height + h_plus) + "px"});
            }, function (e) {
                var item = $(this);
                item.removeClass("open");
                item.css({
                    //"padding-bottom":padding_bottom_start+"px",
                    "margin-bottom": (margin_bottom_start) + "px"
                });
            });

        }
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

    $(".call-modal").on('click', function(e) {
        e.preventDefault();

        var d = $(this).attr('data-target');

        var datareachgoal = $(this).attr('data-reachgoal');

        if(datareachgoal) {
            $(d).attr('data-reachgoal', datareachgoal);
        }
        $(d).animate({
            opacity: 1
        },200).addClass('active');
        $("body").css({"overflow":"hidden"});
        return false;
    });

    $(".korsar-modal").each(function(key, element){
        $(element).on("click", ".close", function(e) {
            console.log("click  .korsar-modal .close");
            e.preventDefault();
            $("body").css({"overflow":"visible"});
            var v  = $(this).closest(".korsar-modal").find("video");
            $.each(v, function(k, v){
                v.pause();
            });
            $(this).closest(".korsar-modal").animate({
                opacity: 0
            },200, function(){
                $(this).removeClass('active');;
            });
            return false;
        });
    });



    $("body").unbind('click').on("click", ".modal-mysalut .close", function(e) {

        var $modal = $(this).closest(".modal-mysalut");
        $modal.animate({
            opacity: 0
        },200, function(){
            $modal.removeClass('active');
            $("body").css({"overflow":"visible"});
        });
        return false;
    });

    $('.cart-v2-wrapper .delivery-call-modal').on('click', function(e) {
        e.preventDefault();
        $("body").css({"overflow":"visible"});
        var d = $(this).attr('data-target');
        $(d).css({"display":"flex"}).animate({
            opacity: 1
        },200);
        $(d).find('.round').unbind('click').on('click', function(){
            $(d).css({"display":"none"}).removeClass('active');
        });
    });
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
    //if(!is_checker_some) {
        $(".bx-filter-parameters-box:nth-child(1)").addClass("bx-active").find(".filter-items.items-vertical").addClass("bx-active");
        $(".bx-filter-parameters-box:nth-child(2)").addClass("bx-active").find(".filter-items.items-vertical").addClass("bx-active");
    //}
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
    $(".header-v2 .filter-btn, .oreder-close-filter-block .menu-btn-mobile-filters").click(function(event) {
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
    $(".header-v2 .menu-btn, .menu-block-header .menu-close")
        .click(function(event) {
            event.preventDefault();

            if($(this).is('.product')) {
                var backUrl =  $(this).attr('data-back-url');
                if(backUrl) {
                    window.location.href = backUrl;
                } else {
                    history.go(-1);
                }
                return false;
            }

            var elem = $(".header-v2 .menu-block-header");

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
        //img.height(h);
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
        history.go(-1);
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

    */
    $('#js-target-main-article-slider').slick({
        infinite: false,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll:3,
        adaptiveHeight: true,
        dots: false,
        lazyLoad: 'ondemand',
        centerMode: false,
        variableWidth: false,
        arrows: true,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    arrows: false,
                    variableWidth: true,
                    slidesToShow: 1,
                    slidesToScroll:1
                }
            }, {
                breakpoint: 1023,
                settings: {
                    centerMode: false,
                    variableWidth: true,
                    slidesToShow: 1,
                    slidesToScroll:1,
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


    /*
       PRODUCTS SLIDER SIMILAR
   */
    $('.js-target-slider-goods-similar').slick({
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
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
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


    $('.catalog-block.catalog-block__slider .product-slick-slider').slick({
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 4,
        adaptiveHeight: false,
        dots: false,
        centerMode: false,
        variableWidth: false,
        arrows: true,
        responsive: [
            {
                breakpoint: 640,
                settings: {
                    arrows: false,
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },{
                breakpoint: 768,
                settings: {
                    arrows: false,
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            }
        ]
    });
};

// Include on HEADER !!! /close

