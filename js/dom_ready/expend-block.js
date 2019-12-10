$(function() {

    $('.mobile-expend-block').each(function (k,v) {
        if($(v).find('.content').innerHeight() <= 112) {
            $(v).find('.expend-fade').hide();
            $(v).find('.expend-button').hide();
        }
    });

    $('.mobile-expend-block').click(function(e) {
        if(!this.isOpen) {
            $(this).find('.expend-text').addClass('show').removeClass('hide');
            $(this).find('.expend-button').text('скрыть');
            $(this).find('.expend-fade').addClass('hide').removeClass('show');
            this.isOpen = true;
        } else {
            $(this).find('.expend-text').addClass('hide').removeClass('show');
            $(this).find('.expend-button').text('ещё');
            $(this).find('.expend-fade').addClass('show').removeClass('hide');
            this.isOpen = false;
        }
    });
});