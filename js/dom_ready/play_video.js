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