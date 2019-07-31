// INCLUDE personal area page /start
"use strict";
function personal_area_zz_call() {
    function fragment(fragmentClass) {
        $(".fragments .active").removeClass("active");
        $("."+fragmentClass).addClass("active");
    }
    $(".personal-navigation .item-navigation").click(function() {
        var fragmentClass = $(this).attr("data");
        $(".personal-navigation .item-navigation").removeClass("active");
        $(this).addClass("active");
        fragment(fragmentClass);
    });
    $(".tax-system .item").click(function(){
        $(".tax-system .item").removeClass("current");
        $(this).addClass("current");
    });
    $(".open_tab").click(function() {
       $(".note-tab-content").removeClass("active");
       var c = $(this).closest(".note").find(".note-tab-content");
       c.addClass("active");
    });
};
// INCLUDE personal area page /close