var liveSearch = function(config) {
    console.log(config);
    var MIN_QUERY_LEN = config.MIN_QUERY_LEN ? config.MIN_QUERY_LEN : 3;

    var limitExecByInterval = function(fn, time) {
        var lock, execOnUnlock, args;
        return function() {
            args = arguments;
            if (!lock) {
                lock = true;
                var scope = this;
                setTimeout(function(){
                    lock = false;
                    if (execOnUnlock) {
                        args.callee.apply(scope, args);
                        execOnUnlock = false;
                    }
                }, time);
                return fn.apply(this, args);
            } else execOnUnlock = true;
        }
    }

    var result = [];
    var searchItemsBySearchString  = limitExecByInterval(function(str) {

        $.post("/local/ajax/search.php",{
            'ajax_call':'y',
            'q':str,
            'l':MIN_QUERY_LEN,
            'INPUT_ID':config.INPUT_ID
        }, function( data ) {
            result = JSON.parse(data);
            searchResultUpdate();
        });
    }, 1000);

    var searchResultUpdate = function(){

        $("#"+config.INPUT_ID).closest(".fieldset-drop-live").find(".live-search-result").remove();

        if(result.length) {
            $("#" + config.INPUT_ID).closest(".fieldset-drop-live").append('<div class="live-search-result"></div>');

            var container = $("#" + config.INPUT_ID).closest(".fieldset-drop-live").find(".live-search-result");

            $.each(result, function (k, v) {
                container.append('<a href="' + v.URL + '">\n' +
                    '<img src="' + v.IMAGE + '" data-loaded="true" style="opacity: 1;">\n' +
                    '<p>' + v.TITLE + '</p>\n' +
                    '</a>');
            });

            console.log(container[0]);

            new SimpleBar(container[0]);
        }
    }

    $("#"+config.INPUT_ID).keyup(function () {

        var val = $(this).val();

        if(val.length >= MIN_QUERY_LEN) {
            searchItemsBySearchString(val);
        } else {
            result = [];
            searchResultUpdate();
        }
    });
};