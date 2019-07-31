function delivery_tab() {

    $(".delivery-tree .header-main").click(function(){
        $(".delivery-tree .col").removeClass("active").find(".delivery-tree-item").hide();
        $(this).closest(".col").addClass("active").find(".delivery-tree-item").show();
        if($( window ).width() >= 768) {
            var h = 0;
            $.each($(this).closest(".col").find(".delivery-tree-items .delivery-tree-item"), function (k, e) {

                h = h + $(e).height();
            });
            $(this).closest(".delivery-tree").height(h);
        }
    });
}