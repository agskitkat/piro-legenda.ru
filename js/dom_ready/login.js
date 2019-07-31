// Login page /start
function login_zz_call() {
    function fragment(fragmentClass) {
        $(".fragments .active").removeClass("active");
        $("."+fragmentClass).addClass("active");
        centerdAlternative();
    }
    $(".fragmentChanger").click(function() {
        var fragmentClass = $(this).attr("data");
        console.log(fragmentClass);
        fragment(fragmentClass);
    }); 
    /*
    function centerdAlternative() {
        var e = $(".fragments .active .alternative");
        var ww = $(".fragments .active").width();
        var w = e.width();
        $(".alternative").css({"margin-left": (ww - w) / 2  + "px"});
        console.log({
            window:ww,
            w:w,
            result: ww-w
        });
    } */
    //centerdAlternative();
};
// Login page /stop