/* ========================================================================
   tools/concepts-money/data.js
   Ordered cases for "Cuenta tu dinero".

   The activity moves from recognising one denomination, to adding pieces,
   to making equivalent values, and finally to finding change. The same
   learning steps use the active locale's coin and banknote catalogue.
   ======================================================================== */
(function () {
  'use strict';

  function recognition(id, cents, opciones) {
    return {
      id: id,
      sceneMode: 'money-token',
      cents: cents,
      opciones: opciones,
      correctaIndex: opciones.indexOf(cents),
      instruccionKey: 'valueQuestion',
      pistaKey: 'pistaMira',
      explicacionKey: 'explicaValor'
    };
  }

  function count(id, pieces, opciones) {
    var total = pieces.reduce(function (sum, cents) { return sum + cents; }, 0);
    return {
      id: id,
      sceneMode: 'money-bundle',
      pieces: pieces,
      opciones: opciones,
      correctaIndex: opciones.indexOf(total),
      instruccionKey: 'countQuestion',
      pistaKey: 'pistaCuenta',
      explicacionKey: 'explicaCuenta'
    };
  }

  function equivalent(id, targetCents, opciones) {
    return {
      id: id,
      sceneMode: 'money-equivalent',
      targetCents: targetCents,
      opciones: opciones,
      correctaIndex: 0,
      targetLabelKey: 'equivalentTarget',
      instruccionKey: 'equivalentQuestion',
      pistaKey: 'pistaEquivalente',
      explicacionKey: 'explicaEquivalente'
    };
  }

  function pieces(values) {
    return { pieces: values };
  }

  function change(id, paidCents, costCents, opciones) {
    var total = paidCents - costCents;
    return {
      id: id,
      sceneMode: 'money-change',
      paidCents: paidCents,
      costCents: costCents,
      opciones: opciones,
      correctaIndex: opciones.indexOf(total),
      paidLabelKey: 'changePaid',
      priceLabelKey: 'changePrice',
      instruccionKey: 'changeQuestion',
      pistaKey: 'pistaCambio',
      explicacionKey: 'explicaCambio'
    };
  }

  var CASOS = {
    es: [
      /* 1. Reconocer monedas y billetes. */
      recognition('es-1', 1, [1, 2, 5]),
      recognition('es-2', 2, [1, 2, 5]),
      recognition('es-5', 5, [2, 5, 10]),
      recognition('es-10', 10, [5, 10, 20]),
      recognition('es-20', 20, [10, 20, 50]),
      recognition('es-50', 50, [20, 50, 100]),
      recognition('es-100', 100, [50, 100, 200]),
      recognition('es-200', 200, [100, 200, 500]),
      recognition('es-500', 500, [200, 500, 1000]),
      recognition('es-1k', 1000, [500, 1000, 2000]),

      /* 2. Contar varias piezas, de menor a mayor. */
      count('es-count-1', [1, 1], [1, 2, 5]),
      count('es-count-2', [5, 5], [5, 10, 20]),
      count('es-count-3', [10, 20], [20, 30, 50]),
      count('es-count-4', [20, 50], [50, 70, 100]),
      count('es-count-5', [50, 50, 100], [100, 150, 200]),
      count('es-count-6', [100, 200], [200, 300, 500]),
      count('es-count-7', [500, 200, 100], [500, 800, 1000]),
      count('es-count-8', [1000, 500, 200], [1000, 1700, 2000]),

      /* 3. Formar el mismo valor con otras piezas. */
      equivalent('es-eq-1', 20, [pieces([10, 10]), pieces([5, 5, 5]), pieces([20, 5])]),
      equivalent('es-eq-2', 50, [pieces([20, 20, 10]), pieces([20, 20]), pieces([50, 10])]),
      equivalent('es-eq-3', 100, [pieces([50, 50]), pieces([20, 20, 20, 20]), pieces([50, 20, 20])]),
      equivalent('es-eq-4', 200, [pieces([100, 100]), pieces([50, 50, 50]), pieces([100, 50, 20])]),
      equivalent('es-eq-5', 500, [pieces([200, 200, 100]), pieces([200, 200]), pieces([100, 100, 100])]),

      /* 4. Calcular la vuelta, primero con monedas y luego con billetes. */
      change('es-change-1', 100, 50, [50, 20, 100]),
      change('es-change-2', 200, 100, [100, 50, 200]),
      change('es-change-3', 500, 200, [300, 200, 500]),
      change('es-change-4', 1000, 600, [400, 300, 500]),
      change('es-change-5', 2000, 800, [1200, 1000, 1500]),
      change('es-change-6', 5000, 1700, [3300, 3000, 5000])
    ]
  };

  /* rewardCents is 1200 (12,00 tokens) in both locales. */
  window.DATA = {
    casos: CASOS.es,
    rewardCents: 1200
  };
})();
