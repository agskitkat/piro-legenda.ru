function zz_scroll_modal() {
    console.log("ELENEMTS", $(".modal"));

    $(".modal").each(function(index, element){
        var $modal = $(element);
        $modal
            .click(function () {
                closeModal($modal);
            })
            .find('.modal-inner')
            .click(function (event) {
                event.stopPropagation();
            })
            .parent()
            .find(".modal__close")
            .click(function () {
                closeModal($modal);
            });

    });


    function openModal($modal) {
        var scrollBarWidth = window.innerWidth - document.body.offsetWidth;
        $('body')
            .css('margin-right', scrollBarWidth)
            .addClass('showing-modal');
        $modal.show();
    };

    function closeModal($modal) {
        $('body')
            .css('margin-right', '')
            .removeClass('showing-modal');
        $modal.hide();
    };


    // Open the modal when open button is pressed.
    $('.js-target-open-bonuse-modal').click(function (event) {
        event.preventDefault();
        var moadlId = $(this).attr("data-modal");
        var $modal = $(moadlId);
        openModal($modal);
    });
}