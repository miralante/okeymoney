/* ==========================================================================
   tools/concepts-money/data.js
   Catalog of Socratic cases for "Cuenta tu dinero sin dudas".
   8 cases per locale, drawn from the official App.money catalog:
     - es: euro coins and banknotes (5 cts … 50 €)
     - en: US coins and banknotes (1¢ … $100)
   Each case: a token (cents) + three options (only one correct) +
   correctaIndex derived from the token amount (so adding/removing
   options never desyncs the index), plus a hint key resolved against
   strings.<locale>.js (`pistaMonedas`, `pistaBilletes`).
   ========================================================================== */
(function () {
  'use strict';

  function buildCasos(spec) {
    return spec.map(function (entry) {
      var opciones = entry.opciones.slice();
      var correctaIndex = opciones.indexOf(entry.cents);
      return {
        id: entry.id,
        cents: entry.cents,
        opciones: opciones,
        correctaIndex: correctaIndex,
        pistaKey: entry.pistaKey
      };
    });
  }

  var CASOS = {
    es: buildCasos([
      { id: 'es-5',   cents: 5,    opciones: [5, 10, 50],       pistaKey: 'pistaMonedas' },
      { id: 'es-20',  cents: 20,   opciones: [10, 20, 50],      pistaKey: 'pistaMonedas' },
      { id: 'es-50',  cents: 50,   opciones: [5, 50, 100],      pistaKey: 'pistaMonedas' },
      { id: 'es-100', cents: 100,  opciones: [50, 100, 200],    pistaKey: 'pistaMonedas' },
      { id: 'es-500', cents: 500,  opciones: [200, 500, 1000],  pistaKey: 'pistaBilletes' },
      { id: 'es-1k',  cents: 1000, opciones: [500, 1000, 2000], pistaKey: 'pistaBilletes' },
      { id: 'es-2k',  cents: 2000, opciones: [1000, 2000, 5000], pistaKey: 'pistaBilletes' },
      { id: 'es-5k',  cents: 5000, opciones: [2000, 5000, 10000], pistaKey: 'pistaBilletes' }
    ]),
    en: buildCasos([
      { id: 'en-1',   cents: 1,    opciones: [1, 5, 25],         pistaKey: 'pistaMonedas' },
      { id: 'en-10',  cents: 10,   opciones: [5, 10, 25],        pistaKey: 'pistaMonedas' },
      { id: 'en-25',  cents: 25,   opciones: [10, 25, 50],       pistaKey: 'pistaMonedas' },
      { id: 'en-100', cents: 100,  opciones: [50, 100, 500],     pistaKey: 'pistaMonedas' },
      { id: 'en-500', cents: 500,  opciones: [100, 500, 1000],   pistaKey: 'pistaBilletes' },
      { id: 'en-1k',  cents: 1000, opciones: [500, 1000, 2000],  pistaKey: 'pistaBilletes' },
      { id: 'en-2k',  cents: 2000, opciones: [1000, 2000, 5000], pistaKey: 'pistaBilletes' },
      { id: 'en-5k',  cents: 5000, opciones: [2000, 5000, 10000], pistaKey: 'pistaBilletes' }
    ])
  };

  /* rewardCents is 1200 (12,00 tokens) in both locales. The practice
     wallet formatter renders it with the active locale's symbol (🪙 in
     both) and decimal separator (, in es, . in en). */
  var REWARD_CENTS = 1200;

  window.DATA = {
    casos: CASOS[App.i18n.locale()] || CASOS.es,
    rewardCents: REWARD_CENTS
  };
})();
