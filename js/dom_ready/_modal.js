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