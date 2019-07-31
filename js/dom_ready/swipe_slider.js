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