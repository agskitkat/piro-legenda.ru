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


    $('.cart-v2-wrapper .delivery-call-modal').on('click', function(e) {
        e.preventDefault();
        var d = $(this).attr('data-target');
        $(d).css({"display":"flex"}).animate({
            opacity: 1
        },200);
        $(d).find('.round').unbind('click').on('click', function(){
            $(d).css({"display":"none"});
        });
    });

};