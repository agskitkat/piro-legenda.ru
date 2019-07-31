function catalog_zz_call(){
    var l = $(".catalog .catalog-block .goods .good").length;
    if (l % 2 !== 0) {
        $(".catalog .catalog-block .goods").addClass("odd");
    } else {
        $(".catalog .catalog-block .goods").addClass("even");
    }
};