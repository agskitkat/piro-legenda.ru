jQuery(function($) {
    function fixDiv() {
        var $cache = $('#getFixed-mobile');
        if ($(window).scrollTop() > 30) {
            var height =  $cache.outerHeight();
            $cache.css({
                'position': 'fixed',
                'top': '0px'
            }).addClass("block-fixed").parent().css({"margin-top":(height-30)+"px"});
        } else {
            $cache.css({
                'position': 'relative',
                'top': 'auto'
            }).removeClass("block-fixed").parent().css({"margin-top":"0px"});
        }
    }
    $(window).scroll(fixDiv);
    fixDiv();
});