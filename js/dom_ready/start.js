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

