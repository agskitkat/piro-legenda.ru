// Include on ORDER PAGE !!!  /open
/*
"use strict";
$().ready(function() {
    // Filter check
    $(".delivery-option").click(function () {
        $(this).parent().find(".current").removeClass("current");
        $(this).addClass("current");
        $(".page-order .forms .step-1").css({"opacity":"1"});
        $(".page-order .forms .form-header").css({"opacity":"1"});
        switch_delivery();
    });
    // First check
    $(".delivery-option").find("input:checked").parent().addClass("current");

    var chs = "";
    function switch_delivery() {
        chs =  $(".delivery-option").find("input:checked").val();

        $(".pay-system").find("input:checked").parent().addClass("current");

        $(".del-russia").css({"display":"none"});
        $(".del-moscow").css({"display":"none"});
        $(".del-none-display").css({"display":"none"});
        $(".del-none").css({"display":"block"});

        switch (chs) {
            case "del-russia" :
                $(".del-russia").css({"display":"block"});
                break;
            case "del-moscow" :
                $(".del-moscow").css({"display":"block"});
                break;
            case "del-none" :
                $(".del-none").css({"display":"none"});
                $(".del-none-display").css({"display":"block"});
                break;
        }
    }
    switch_delivery();

    // Filter check
    $(".pay-system .item").click(function() {
        $(this).parent().find(".current").removeClass("current");
        $(this).addClass("current");
    });
    // First check
    $(".pay-system").find("input:checked").parent().addClass("current");

    // Проверка и отправка формы step-1
    $(".save-lk").click(function() {
        // Делать проверку полей
        if(check_form($(".step-1"))) {
            // TODO ajax save data here
            // В идеале получить прошлый адрес доставки и заполнить форму SыыTEP-2
            var ajax = true;
            if(ajax) {
                $(".step-2").css({"display":"block"});
                $(".step-2").css({"opacity":"1"});
                $(this).html("СОХРАНЕНО");
                $(".form-down-block .disabled").removeClass("disabled");
            }
        }
    });



    $("input.kladr").kladr({
        oneString: true
    });


    function cost_adress_action_dilevery(address) {
        $(".deliviry-cost .cost").html("Расчёт стоимости...");
        getDistanceByAddress(address, function (distance) {
            var coast = "Уточняйте у менеджера";
            if (distance < 70) {
                coast = "2500 рублей";
            }
            if (distance < 50) {
                coast = "1000 рублей";
            }
            if (distance < 30) {
                coast = "Бесплатно";
            }
            $(".deliviry-cost .cost").html(coast + " (~" + distance + "км)");
        });
    }


    var timer = null;
    $("#coast_address").keyup(function () {
        var address = $(this).val();
        clearTimeout(timer);
        timer = setTimeout(function() {
            cost_adress_action_dilevery(address);
        }, 1000)
    });

});
// Include on ORDER PAGE !!!  /close

*/