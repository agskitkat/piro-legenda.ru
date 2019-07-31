// include anyway !!!!!! \start

//Auto Currying (автоматическое каррирование)
window.declOfNum = function(n, titles) {
    return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

var rad = function(x) {
    return x * Math.PI / 180;
};
var getDistance = function(lat1, long1, lat2, long2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(lat2 - lat1);
    var dLong = rad(long2 - long1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
};

function getDistanceByAddress(address, callback) {
    var pos_start = [55.753869, 37.770694]; // Оффис
    var pos_ar = [];
    var api_yandex = "d14ef91a-a8fe-4afe-afd5-c31f8b9c3066";
    $.getJSON( "https://geocode-maps.yandex.ru/1.x/?apikey="+api_yandex+"&results=1&format=json&geocode="+address, function( data ) {
        var pos = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos ? data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos : false;
        var d = false;
        if(pos) {
            var pos_ar = pos.split(" ");
            var d  = +Math.round(getDistance( +pos_start[0], +pos_start[1], +pos_ar[1], +pos_ar[0]) / 1000);
            console.log( +pos_start[0], +pos_start[1], +pos_ar[1], +pos_ar[0],  d );
        } else {
            console.log(data);
            // TODO google go coder
        }
        callback(d, pos_ar);
    });
}

function check_browser() {
    if (document.all) {
        
    }
}

// include anyway !!!!!! \close