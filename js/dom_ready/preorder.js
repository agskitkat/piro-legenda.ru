function preorder_zz_call() {

    function setErrorOnInput(input, str) {
        var block = $(input).closest(".input-border-label-out");
        $(block).addClass("error");
        var error = $(block).find("error");
        $(error).html(str);
    }

    function removeErrorOnInput(input) {
        var block = $(input).closest(".input-border-label-out");
        $(block).removeClass("error");
    }

    $("#sendSMS").click(function() {
        var input = $("#phoneSMS");
        var phone = $(input).val();
        var res = phone.match(/\+7\(\d{3}\)\d{3}\-\d{2}\-\d{2}/gm);

        if(!res) {
            setErrorOnInput(input, "Неверно указан номер телефона");
            return false;
        }
        removeErrorOnInput(input);

        $(".sms-step-1").hide();
        $(".sms-step-2").addClass("active");

        //TODO: HERE
    });
}