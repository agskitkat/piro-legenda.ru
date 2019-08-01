var modal_complite = '<div class="korsar-modal js-action-form-was-send" style="display: block; opacity: 1;">\n' +
    '            <div class="wrap">\n' +
    '                <div class="modal-body" style="max-width:360px; height:420px">\n' +
    '                    <div class="close"><span class="korsar-icon close"></span></div>\n' +
    '                    <div class="header" style="margin-top:20px;margin-bottom:20px;"></div>\n' +
    '                    <div class="form-2"  style="text-align: center;">\n' +
    '                        <img style="width:80px;" src="/local/templates/pyrosalut/images/svg/check-2.svg">\n' +
    '                        <p>Спасибо</p><p>Cсылка на прайс-лист успешно отправлена на указанный e-mail. Пожалуйста, проверьте почту в течении нескольких минут.</p>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>';

var block_send = false;
var old_text = "";
function test_send_form(element) {

    var reachGoal = $(element).closest(".korsar-modal").attr('data-reachgoal');
    console.log("reachGoal:"+ reachGoal);
    var btn =  $(element);

    var form_1 = $(element).parent();
    name = "Без имени";



    if(check_form(form_1, "on-view")) {
        var name = form_1.find(".i-name").val();
        var phone = form_1.find(".i-phone").val();
        var email = form_1.find(".i-email").val();
        var point = form_1.find(".i-point").val();
        //showBlock_2(name);


        block_send = false;
        form_1.find(".js-action-do-auth").html("Подождите, отправка...");

        if(block_send) {
            return false;
        }

        var old_text = btn.text();
        btn.text("Отправка...");

        $.ajax({
            type: "POST",
            url: "/local/ajax/hash_auth.php",
            data: JSON.stringify({name: name, email: email, phone: phone,city: point})
        }).done(function (data) {
            block_send = true;
            btn.text(old_text);

            form_1.find(".js-action-do-auth").html("Получить оптовы цены");
            if (data.length) {
                $(form_1).find(".error").remove();
                $.each(data, function (k, v) {
                    $(form_1).append('<div class="error red">' + v.error + '</div>');
                });
            } 
 
            if (data.code == "200" && data.error == "null") {
                $(".korsar-modal").animate({
                    opacity: 0
                }, 200, function () {
                    $(this).css({"display": "none"});
                }).removeClass("active");

                $("body").append(modal_complite);

                if (reachGoal) {
                    window.yaCounter51429325.reachGoal(reachGoal);
                } else {
                    window.yaCounter51429325.reachGoal('Lid-button');
                }
            }
        });
    }
}

/*
$("body").on("click", ".korsar-modal .js-action-do-auth", function(e){
    console.log("Check form !");
    test_send_form(this);
});
*/

function price_form_zz_call() {

    var modal = '<div class="korsar-modal js-action-open-price">'+
        '<div class="wrap">'+
        '<div class="modal-body" style="max-width:360px; height:480px">'+
        '<div class="close">'+
        '<span class="korsar-icon close"></span>'+
        '</div>'+
        '<div class="header" style="margin-top:20px;margin-bottom:0px;">Оформи заявку сейчас и получить <span class="red">скидку до 45%</span> !</div>'+
        '<div class="form">'+
        '<fieldset>'+
        '<span class="korsar-icon user-w"></span>'+
        '<input type="text" class="i-name korsar-input" placeholder="Имя"  data-pattern="notnull" required>'+
        '</fieldset>'+
        '<fieldset>'+
        '<span class="korsar-icon phone"></span>'+
        '<input type="text" class="i-phone korsar-input" placeholder="Телефон" data-pattern="phone" required>'+
        '</fieldset>'+
        '<fieldset>'+
        '<span class="korsar-icon mail"></span>'+
        '<input type="text" class="i-email korsar-input" placeholder="Email" data-pattern="email" required>'+
        '</fieldset>'+
        '<fieldset>'+
        '<span class="korsar-icon point"></span>'+
        '<input type="text" class="i-point korsar-input" placeholder="Город" data-pattern="notnull" required>'+
        '</fieldset>'+
        '<button type="button" class="js-action-do-auth button green active" onclick="test_send_form(this)">Получить прайс-лист</button>'+
        '<fieldset class="checkbox" style="padding-top: 21px;">' +
        '<span class="checkbox">' +
        '<span class="korsar-icon check">' +
        '</span>' +
        '</span> ' +
        '<label style="font-size: 9px;">Согласен(а) с <a href="/personal/personal-data-policy/">политикой конфиденциальности</a></label>' +
        '<input type="hidden"></fieldset>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>';

    $("body").append(modal);
};