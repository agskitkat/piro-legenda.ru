function run_slider() {
    $(".slider").each( function(key, slider){
        var max_margin = 0;
        var margin_sep = 20;

        var slides_count = 0;
        var now_count = 1;

        var start_x = 0;
        var cancel_x = 0;
        var buffer = 50;

        // Max margin
        $(slider).find(".slide").each(function(key, slide){
            max_margin += $(slide).outerWidth() ;
            slides_count++;
        });

        $(slider).find(".wrap").css({"width":max_margin+"px"});

        $(slider).on('touchstart', function(e){
            start_x = e.originalEvent.touches[0].pageX;
        });

        $(slider).on('touchmove', function(e){
            cancel_x = e.originalEvent.touches[0].pageX;
        });

        $(slider).on('touchend', function(event){
            event.stopPropagation();
            event.preventDefault();
            var x = start_x - cancel_x;
            if(x < buffer*-1) {
                move_slide(-1);
            }
            if(x > buffer) {
                move_slide(1);
            }
        });


        $(slider).parent().on('click', ".next-arrow", function(e){
            move_slide(1);
        });

        $(slider).parent().on('click', ".prev-arrow", function(e){
            move_slide(-1);
        });


        function move_slide(derection) {
            if((now_count + derection) <= slides_count && (now_count + derection) > 0) {
                now_count = now_count + derection;
                var s_c = 0;
                var m = 0;
                $(slider).find(".slide").each(function(key, slide){
                    s_c++;
                    if(now_count > s_c) {
                        m += $(slide).outerWidth();
                    }
                });
                $(slider).find(".wrap").css({"margin-left":((m*-1))+"px"});
            }
        }
    });
}
function run_video() {
    $(".js-play-video").click(function(){
        var video_link = $(this).attr("data-video");
        $("body").find(".video-modal .video-player").attr("src", video_link);
    });
}
function send_valid_form(elem) {
    var form = $(elem).closest("form");

    if(check_form(form, "on-view")) {
        $(elem).html("<div class='loader_button'></div>");
        var a = $(form).serializeArray();
        $.ajax({
            type: 'POST',
            url: form.attr("action"),
            data: a,
            success: function(msg){
                $(form).closest(".callback-form").parent().html(msg);
            }
        });
    }
};

function run_timer() {
    $(".timer").each( function(key, timer) {

        var target_date = new Date().getTime() + (1000*3600*24); // установить дату обратного отсчета
        var days, hours, minutes, seconds; // переменные для единиц времени

        //getCountdown();

        setInterval(function () { getCountdown(); }, 1000);

        function getCountdown(){

            var current_date = new Date().getTime();
            var seconds_left = (target_date - current_date) / 1000;

            days = pad( parseInt(seconds_left / 86400) );
            seconds_left = seconds_left % 86400;

            hours = pad( parseInt(seconds_left / 3600) );
            seconds_left = seconds_left % 3600;

            minutes = pad( parseInt(seconds_left / 60) );
            seconds = pad( parseInt( seconds_left % 60 ) );

            $(timer).find(".days").html(days);
            $(timer).find(".hours").html(hours);
            $(timer).find(".minute").html(minutes);
            $(timer).find(".seconds").html(seconds);

        }

        function pad(n) {
            return (n < 10 ? '0' : '') + n;
        }

    });
}

$().ready(function(){
    run_slider();
    run_video();
    run_timer();
});