function hms(input_str) {
    if(input_str) {
        var str = input_str.replace(/<[^>]+>/g, '');

        var r = str.match(/([\d\.]+)[ ]*([\W]+)(\d*)?/);

        if (r != null)
            if (r[1] && r[2] && r[1] != null && r[2] != null) {
                var num = parseFloat(r[1]);
                var key = r[2].replace(' ', '');
                key = key.replace(/\s+/g, '');

                var pow = r[3] ? r[3] : 1;

                // console.log(num, key, pow);

                var match = [
                    {
                        v: 1,
                        k: "гр",
                        m: [
                            "гр", "гр.", "грамм", "г."
                        ]
                    }, {
                        v: 1000,
                        k: "гр",
                        m: [
                            "кг", "кг.", "килограмм"
                        ]
                    }, {
                        v: (1000 * 1000),
                        k: "гр",
                        m: [
                            "т", "т.", "тонн", "тонна"
                        ]
                    }, {
                        v: 1,
                        k: "м",
                        m: [
                            "м", "м.", "метр", "метры", "меторв"
                        ]
                    }, {
                        v: 0.01,
                        k: "м",
                        m: [
                            "см", "см.", "сантиметр", "сантиметры", "сантиметорв"
                        ]
                    }, {
                        v: 0.001,
                        k: "м",
                        m: [
                            "мм", "мм.", "миллиметр", "миллиметры", "миллиметорв", "мм."
                        ]
                    }, {
                        v: 0.1,
                        k: "м",
                        m: [
                            "дм", "дм.", "дециметр", "дециметры", "дециметорв"
                        ]
                    }
                ];
                for (var i = 0; match.length > i; i++) {
                    var p = match[i].m[match[i].m.indexOf(key)];
                    if (p) {
                        num = Math.pow(match[i].v, pow) * parseFloat(num);
                        key = match[i].k;
                    }
                }
                // console.log(num, key, pow);

                var normal = [
                    {
                        c: "гр",
                        k: 1000,
                        v: "кг"
                    }, {
                        c: "гр",
                        k: (1000 * 1000),
                        v: "т"
                    }, {
                        c: "м",
                        k: 0.01,
                        v: "см"
                    }, {
                        c: "м",
                        k: 0.001,
                        v: "мм"
                    }, {
                        c: "м",
                        k: 0.1,
                        v: "дм"
                    },
                ];
                for (var i = 0; normal.length > i; i++) {

                    if ((num > 1000 || num < 1) && normal[i].c === key) {
                        var p = num / Math.pow(normal[i].k, pow);
                        if (p < 1000 && p >= 1) {
                            num = p;
                            key = normal[i].v;
                        }
                    }

                }
                if (pow === 1) {
                    pow = "";
                }


                return +num.toFixed(2) + " " + key + "" + pow;
            }
    }
    return input_str;
}

$(document).ready(function(){
    $('.sittings__block .value').each(function(el, k) {
        $(k).html( hms( $(k).html() ) );
    });

    $('.info .value span').each(function(el, k) {
        $(k).html( hms( $(k).html() ) );
    });
});
