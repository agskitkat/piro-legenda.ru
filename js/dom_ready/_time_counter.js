function time_counter_zz_call(){
    $(".time-counter").each(function(key, counter){

        var c = $(counter);
        var deathline = c.attr("data-deathline");
        var days_offset = c.attr("data-days") ? c.attr("data-days") : 1 ;

        var newtime =  getTimeRemaining(deathline);
        c.find(".days span").html(days_offset - 1); 
        c.find(".hours span").html(newtime.hours);
        c.find(".minutes span").html(newtime.minutes);
        c.find(".seconds span").html(newtime.seconds);

        var theDaysBox  = c.find(".days span");
        var theHoursBox = c.find(".hours span");
        var theMinsBox  = c.find(".minutes span");
        var theSecsBox  = c.find(".seconds span");


        var refreshId = setInterval(function() {

            var currentSeconds = theSecsBox.text();
            var currentMins    = theMinsBox.text();
            var currentHours   = theHoursBox.text();
            var currentDays    = theDaysBox.text();

            if(currentSeconds == 0 && currentMins == 0 && currentHours == 0 && currentDays == 0) {
                // if everything rusn out our timer is done!!
                // do some exciting code in here when your countdown timer finishes
                currentDays = days_offset;
            }

            if(currentSeconds == 0 && currentMins == 0 && currentHours == 0) {
                // if the seconds and minutes and hours run out we subtract 1 day
                theDaysBox.html(currentDays-1);
                theHoursBox.html("23");
                theMinsBox.html("59");
                theSecsBox.html("59");
            } else if(currentSeconds == 0 && currentMins == 0) {
                // if the seconds and minutes run out we need to subtract 1 hour
                theHoursBox.html(addZerro(currentHours-1));
                theMinsBox.html("59");
                theSecsBox.html("59");
            } else if(currentSeconds == 0) {
                // if the seconds run out we need to subtract 1 minute
                theMinsBox.html(addZerro(currentMins-1));
                theSecsBox.html("59");
            } else {
                theSecsBox.html(addZerro(currentSeconds-1));
            }
            c.css({"display":"block"});
        }, 1000);


    });

    function addZerro(int_val) {
        if(int_val > 9) {
            return "" + int_val;
        }
        return "0" + int_val;
    }


    function getTimeRemaining(endtime){
        var t = Date.parse(endtime) - Date.parse(new Date());
        var seconds = Math.floor( (t/1000) % 60 );
        var minutes = Math.floor( (t/1000/60) % 60 );
        var hours = Math.floor( (t/(1000*60*60)) % 24 );
        var days = Math.floor( t/(1000*60*60*24) );
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }
};