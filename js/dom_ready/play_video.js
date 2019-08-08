// INCLUDE where good video /start
function paly_video_zz_call() {

    var is_out = true;

    /*
    if(window.innerWidth > 1024) {
        //console.log("1024");
        $(".good-v2__image-video").mouseenter(function() {
            if(is_out) {
                is_out = false;
                play_video($(this).find(".play_video"));
            }
        });
    }
    */

    $(document).on('click', ".play_video", function() {
        play_video(this);
    });


    function play_video(element) {

        // Close old; codecs="avc1.42E01E, mp4a.40.2"
        // console.log("Video play");

        // good-v1 video close
        $.each($(".video_view"), function(key, v){
            if( $(v).html() ) {
                var good_image_block = $(v).closest(".good_image_block").length ? $(v).closest(".good_image_block") : $(v).closest(".good_image");
                //console.log("Old play...");
                var image = good_image_block.find("img");
                $(v).css({ "display":"none" });
                image.css({
                    "opacity":"1"
                });
                $(v).html("")
            }
        });

        // good-v2 video close
        $.each($(".good-v2__video"), function(key, v){
            var video = $(v);
            video.hide();
            video.html("");
            video.parent().find(".good-v2__video-button").show();
            video.parent().find(".good-v2__video-button.close").hide();

        });


        if( $(element).is(":not(.good-v2__video-button)") ) {
            // console.log(":not(.good-v2__video-button)");
            var good_image_block = $(element).closest(".good_image_block").length ? $(element).closest(".good_image_block") : $(element).closest(".good_image");
            var video = good_image_block.find(".video_view");
            var image = good_image_block.find("img");
            image.css({
                "opacity": "0"
            });
            video.css({
                "display": "block",
                "width": good_image_block.width() + "px",
                "height": good_image_block.height() + "px"
            });
        } else {
            var good_image_block =  $(element).parent();
            var video = good_image_block.find(".js-target-video-play");
            var image = good_image_block.find(".good-v2__image img");
            image.css({
                "opacity": "0"
            });
            video.css({
                "display": "block",
                "width": good_image_block.width() + "px",
                "height": good_image_block.height() + "px"
            });
            good_image_block.find(".good-v2__video-button").hide();
            good_image_block.find(".good-v2__video-button.close").css({ "display":"flex" });
        }

        // EMPTY VIDEO PATH
        var video_path = {"mp4":"video/videoplayback.mp4", "webm":"video/videoplayback.webm"};
        if(video.attr("data-video")) {
            video_path = jQuery.parseJSON(video.attr("data-video"));
        }

        video.html( '<div class="close korsar-icon"></div>' +
            '<video autoplay="autoplay" width="'+good_image_block.width()+'" height="'+good_image_block.height()+'" controls="controls" poster="'+image.attr("data-src")+'">'+
            '<source src="'+video_path.mp4+'" type="video/mp4">'+ // Add more source...
            '<source src="'+video_path.webm+'" type="video/webm">'+ // Add more source...
            'Тег video не поддерживается вашим браузером.'+
            '<a href="'+video_path.mp4+'">Скачайте видео</a>.'+
            '</video>');


        if( $(element).is(":not(.good-v2__video-button)") ) {

            video.find(".close").click(function () {
                video.css({"display": "none"});
                image.css({
                    "opacity": "1"
                });
                video.html(" ");
            });

        } else {
            good_image_block.find(".close").click(function () {
                is_out = true;
                // console.log("close");
                good_image_block.find(".good-v2__video-button").show();
                good_image_block.find(".good-v2__video-button.close").hide();
                video.css({"display": "none"});
                image.css({
                    "opacity": "1"
                });
                video.html(" ");
            });
        }
    }
};
// INCLUDE where good video /close