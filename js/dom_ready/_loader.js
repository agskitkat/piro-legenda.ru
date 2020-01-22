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