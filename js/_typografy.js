/*
"use strict";
// Утилиты и типографические улучшайзеры

$().ready(function() {
    var truncate = function(description, width, rows){
        var l = 50;
        var char_w = 12;
        var max_chars = (width * rows) / char_w;
        console.log(max_chars);
        if(description.split('').length > max_chars) {
            return description.split('').slice(0, description.lastIndexOf(" ", max_chars)).join('') + "...";
        }
        return description;
    }

    $(".truncate-text").each(function(key, element) {
        var width =  $(element).width();
        var t =  truncate( $(element).text(), width, 2 );
        $(element).html(t);
    });
}); */