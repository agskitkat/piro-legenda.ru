// MAIN PAGE
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
                window.yaCounter51429325.reachGoal('forma-obratnoj-svyazi');
                $(form).closest(".callback-form").parent().html(msg);
            }
        });
    }
};

function send_valid_form_email(elem) {
    var form = $(elem).closest("form");
    if(check_form(form, "on-view")) {
        $(elem).html("<div class='loader_button'></div>");
        var a = $(form).serializeArray();
        $.ajax({
            type: 'POST',
            url: form.attr("action"),
            data: a,
            success: function(msg){
                $(form).parent().html(msg);
            }
        });
    }
};

// MAIN PAGE end