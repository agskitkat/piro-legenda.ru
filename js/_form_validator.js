"use strict";
function force_validate() {
    $('body').on('keyup', 'input:not([data-pattern=\"\"])', function(){
        validate($(this), true, false);
    });

    $('body').on('focusin', 'input:not([data-pattern=\"\"])', function(){
        var input = $(this);
        input.closest("fieldset").find(".tooltype").css({"display":"block"});
    });

    $('body').on('focusout', 'input:not([data-pattern=\"\"])', function(){
        var input = $(this);
        input.closest("fieldset").find(".tooltype").css({"display":"none"});
    });

    $('body').on('focusin', 'input', function(){
        var icon =  $(this).closest("fieldset").find("> .korsar-icon");
        icon.addClass("c");
    });

    $('body').on('focusout', 'input', function(){
        var icon =  $(this).closest("fieldset").find("> .korsar-icon");
        icon.removeClass("c");
    });
}

force_validate();


function validate(input, viewMessage, force) {
    if(!input.prop('required')) {
        return true;
    }


    var pattern = input.attr("data-pattern");
    var value = input.val();
    var errors = [];
    input.closest("fieldset").find(".tooltype").remove();

    var patterns = {
        notnull: function () {
            var per_name = /^.{1,}$/gm;
            if (!per_name.test(value)) {
                errors.push("В поле присутствуют недопустимые символы. Вводите русские буквы.");
                return false;
            }
            return true;
        },
        cirilic: function () {
            var per_name = /^[А-Яа-я\s]{1,}$/gm;
            if (!per_name.test(value)) {
                errors.push("В поле присутствуют недопустимые символы. Вводите русские буквы.");
                return false;
            }
            return true;
        },
        email: function () {
            var per_name = /^.+@.+\..+$/gm;
            if (!per_name.test(value)) {
                errors.push("В поле присутствуют недопустимые символы. Вводите e-mail, используя английские буквы, цифры, @, тире, нижнее подчеркивание и точки");
                return false;
            }
            return true;
        },
        phone: function () {
            var per_name = /^[0-9\+\-\(\)]{11,}$/gm;
            if (!per_name.test(value)) {
                errors.push("Номер слишком короткий. Вводите номер с кодом региона для стационарных (например, 8 (495) 800-81-91) или с кодом для мобильных (через 8 или +7 для России).");
                return false;
            }
            return true;
        },
        INN: function () {
            var per_name = /(^[0-9]{10}$)|(^[0-9]{12}$)/gm;
            if (!per_name.test(value)) {
                errors.push("Не хватает цифр. ИНН для ИП состоит из 12 цифр, для компаний - из 10.");
                return false;
            }
            return true;
        },
        KPP: function () {
            var per_name = /^([0-9]{9}$)|(\-{1}$)/gm;
            if (!per_name.test(value)) {
                errors.push("Цифр менее 9. Проверьте данные. Если Вы ИП, проставьте тире “-”");
                return false;
            }
            return true;
        },
        OGRN: function () {
            var per_name = /(^[0-9]{13}$)|(^[0-9]{15}$)/gm;
            if (!per_name.test(value)) {
                errors.push("Не хватает цифр. ОГРН для ИП состоит из 15 символов, для компаний - из 13.");
                return false;
            }
            return true;
        },
        cirilic_adress: function () {
            var per_name = /^.{1,}$/gm;
            if (!per_name.test(value)) {
                errors.push("В поле присутствуют недопустимые символы. Допускаются только русские буквы, цифры, запятые и точки");
                return false;
            }
            return true;
        },
        cirilic_company_name: function () {
            var per_name = /^[А-Яа-я0-9\«\»\“\”\"\"\'\'\:\-\s]{4,}$/gm;
            if (!per_name.test(value)) {
                errors.push("В поле присутствуют недопустимые символы. Допускаются только русские буквы, цифры, «», “”, :, -");
                return false;
            }
            return true;
        },
        password: function () {
            var per_name = /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}/gm;
            if (!per_name.test(value)) {
                errors.push("Придумайте надёжный пароль содержащий не менее 8-ми символов, содержащий заглвную и строчную букву латинского алфавита, цифру и символ <b>! @ # $ % ^ & *</b>");
                return false;
            }
            return true;
        },
        match: function () {
            var match = input.attr("data-pattern-match");
            if (value !== $(match).val()) {
                errors.push("Пароли должны совпадать");
                return false;
            }
            return true;
        },
        date_time: function () {
            return true;
        }
    }

    if (patterns[pattern]) {
        if (!patterns[pattern]() && (value || force) ) {
            input.closest("fieldset").append("<div class=\"tooltype\">" + errors[0] + "</div>");
            input.closest("fieldset").addClass("no-valid").removeClass("valid");
            if(viewMessage) {
                input.closest("fieldset").find(".tooltype").css({"display": "block"});
            }
            return false;
        } else {
            input.closest("fieldset").find(".tooltype").remove();
            input.closest("fieldset").removeClass("no-valid").addClass("valid");
            return true;
        }
    }
    return true;
}


function check_form(parent, on_view) {
    var r = true;
    $(parent).find('input:not([data-pattern=\"\"]):visible').each(function(k, input) {
        var v = validate($(input), false, true);
        console.log(v);
        if(!v) {
            r = false;
        }
    });
    return r;
}