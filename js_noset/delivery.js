"use strict";
var office_ccord = [55.753869, 37.770694]; // Оффис
var points = [
    {
        pos :  [55.755510, 37.767224],
        name : "Байкал-сервис"
    }, {
        pos :  [55.658285, 37.262085],
        name : "ПЭК"
    }, {
        pos :  [55.692382, 37.418552],
        name : "ПЭК"
    }, {
        pos :  [55.717470, 37.757346],
        name : "ПЭК"
    }, {
        pos :  [55.808662, 37.741243],
        name : "ПЭК"
    }, {
        pos :  [55.751922, 37.724201],
        name : "Деловые линии"
    }, {
        pos :  [55.782213, 37.678126],
        name : "Деловые линии"
    }, {
        pos :  [55.791740, 37.896771],
        name : "Деловые линии"
    }, {
        pos :  [55.876396, 37.331113],
        name : "Деловые линии"
    }
];



    ymaps.ready(function () {

        var map = new ymaps.Map("map", {
            center: [55.76, 37.64],
            zoom: 10,
            controls: ['zoomControl']
        });

        if (map) {
            ymaps.modules.require(['Placemark', 'Circle'], function (Placemark, Circle) {
                var placemark = new Placemark([55.37, 35.45]);
            });


            var XGeoObject = new ymaps.Placemark(office_ccord, {
                iconCaption: "Ваш адрес"
            });
            XGeoObject.options.set('visible', false);
            map.geoObjects.add(XGeoObject);
            XGeoObject.events.add('click', function (e) {
                d_coords(e.get('coords'));
            });


            $.each(points, function (k, val) {
                var myGeoObject = new ymaps.Placemark(val.pos, {
                    iconCaption: val.name
                });
                map.geoObjects.add(myGeoObject);
                myGeoObject.events.add('click', function (e) {
                    d_coords(e.get('coords'));
                });

            });

            var zone1 = new ymaps.GeoObject(
                {
                    geometry: {
                        type: "Circle",
                        coordinates: [55.753869, 37.770694],
                        radius: 30000
                    },
                    properties: {
                        balloonContent: "Зона доставки 1 <br> <b>БЕСПЛАТНО</b>"
                    }
                },
                {
                    // Описываем опции геообъекта.
                    // Цвет заливки.
                    fillColor: '#94ed7d',
                    // Цвет обводки.
                    strokeColor: '#3fed43',
                    // Общая прозрачность (как для заливки, так и для обводки).
                    opacity: 0.2,
                    // Ширина обводки.
                    strokeWidth: 3
                }
            );

            var zone2 = new ymaps.GeoObject(
                {
                    geometry: {
                        type: "Circle",
                        coordinates: [55.753869, 37.770694],
                        radius: 50000
                    },
                    properties: {
                        balloonContent: "Зона доставки 2 <br> Стоимость доставки <b>1000 рублей</b>"
                    }
                },
                {
                    // Описываем опции геообъекта.
                    // Цвет заливки.
                    fillColor: '#edea76',
                    // Цвет обводки.
                    strokeColor: '#eda51e',
                    // Общая прозрачность (как для заливки, так и для обводки).
                    opacity: 0.2,
                    // Ширина обводки.
                    strokeWidth: 3
                }
            );

            var zone3 = new ymaps.GeoObject(
                {
                    geometry: {
                        type: "Circle",
                        coordinates: [55.753869, 37.770694],
                        radius: 70000
                    },
                    properties: {
                        balloonContent: "Зона доставки 3 <br> Стоимость доставки <b>2500 рублей</b>"
                    }
                },
                {
                    // Описываем опции геообъекта.
                    // Цвет заливки.
                    fillColor: '#ed8186',
                    // Цвет обводки.
                    strokeColor: '#ed2929',
                    // Общая прозрачность (как для заливки, так и для обводки).
                    opacity: 0.2,
                    // Ширина обводки.
                    strokeWidth: 3
                }
            );

            map.geoObjects.add(zone3);
            map.geoObjects.add(zone2);
            map.geoObjects.add(zone1);

            zone3.events.add('click', function (e) {
                d_coords(e.get('coords'));
            });
            zone2.events.add('click', function (e) {
                d_coords(e.get('coords'));
            });
            zone1.events.add('click', function (e) {
                d_coords(e.get('coords'));
            });
        }

        function d_coords(coords) {
            var distance = +Math.round(getDistance(coords[0], coords[1], office_ccord[0], office_ccord[1]) / 1000);

            draw_cost(distance);
        }


        var timer = null;
        $("#coast_address_2")/*.change(function () {
            var address = $(this).val();
            cost_adress_action(address)
        })*/.keyup(function () {
            var address = $(this).val();
            clearTimeout(timer);
            timer = setTimeout(function() {
                cost_adress_action(address);
            }, 1000)
        });

        function cost_adress_action(address) {
            getDistanceByAddress(address, function (distance, coodrs) {
                XGeoObject.geometry.setCoordinates([coodrs[1],coodrs[0]]);
                XGeoObject.options.set('visible', true);
                draw_cost(distance);
            });
        }


        function draw_cost(distance) {
            var coast = "Уточняйте у менеджера";
            var zone = 0;
            if (distance < 70) {
                coast = "2500 рублей";
                var zone = 3;
            }
            if (distance < 50) {
                coast = "1000 рублей";
                var zone = 2;
            }
            if (distance < 30) {
                coast = "Бесплатно";
                var zone = 1;
            }
            $(".deliviry-cost .cost").html('<span class="gray">Зона <span class="zone">' + zone + '</span> - </span>' + coast + " (~" + distance + "км)");
        }

    });
