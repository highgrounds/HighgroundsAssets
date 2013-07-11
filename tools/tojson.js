var jsdom = require('jsdom'),
    currencies = [
        'gold',
        'crystal',
        'wood'
    ],
    rarity = [
        'common',
        'uncommon',
        'rare',
        'ultra-rare'
    ];

jsdom.env({
    file: process.argv[2],
    done: function (errors, window) {
        var $ = window.document.querySelectorAll.bind(window.document),
            data = {
                units: [],
                cities: []
            };

        Array.prototype.forEach.call($('CARD'), function (card, idx) {
            if (idx === 0) {
                return;
            }
            var unit = {
                    id: card.getAttribute('id'),
                    name: card.getElementsByTagName('RIG')[0].textContent,
                    edition: card.getAttribute('edition'),
                    rarity: rarity[parseInt(card.getAttribute('rarity'), 10)],
                    types: Array.prototype.map.call(card.querySelectorAll('TYPE'), function (element) {
                        return element.textContent;
                    }),
                    battle: [],
                    home: [],
                    buy: []
                };

            currencies.forEach(function (currency) {
                var amount = parseInt(card.getAttribute(currency.charAt(0)), 10);

                if (amount) {
                    unit.buy.push({
                        currency: currency,
                        amount: amount
                    });
                }
            });

            unit.sell = unit.buy.map(function (cost) {
                return {
                    currency: cost.currency,
                    amount: Math.ceil(cost.amount / 2)
                };
            });

            Array.prototype.forEach.call(card.querySelectorAll('ACTION'), function (element) {
                var target = unit[element.getAttribute('location')],
                    action = {
                        ability: element.getAttribute('type'),
                        amount: parseInt(element.getAttribute('value'), 10)
                    };

                if (action.ability === 'windfall') {
                    unit.sell[0].amount = action.amount;
                }

                if (action.ability === 'renegade') {
                    unit.sell[0].amount = action.amount;
                }

                target.push(action);
            });


            data.units.push(unit);
        });

        Array.prototype.forEach.call($('CITY'), function (element, idx) {
            if (idx === 0) {
                return;
            }
            var city = {
                    id: element.getAttribute('id'),
                    name: element.getAttribute('name'),
                    edition: element.getAttribute('edition'),
                    types: Array.prototype.map.call(element.querySelectorAll('TYPE'), function (element) {
                        return element.textContent;
                    }),
                    home: Array.prototype.map.call(element.querySelectorAll('ACTION'), function (element) {
                        return {
                            ability: element.getAttribute('type'),
                            amount: element.getAttribute('value')
                        };
                    })
                };

            data.cities.push(city);
        });

        console.log(JSON.stringify(data, undefined, 4));
    }
});
