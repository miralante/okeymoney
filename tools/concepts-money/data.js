/* ========================================================================
   tools/concepts-money/data.js
   Ordered cases for "Cuenta tu dinero".

   The activity moves from recognising one denomination, to adding pieces,
   to making equivalent values, and finally to finding change. The same
   learning steps use the active locale's coin and banknote catalogue.
   ======================================================================== */
(function () {
  'use strict';

  function recognize(id, cents, opciones) {
    return {
      id: id,
      sceneMode: 'money-token',
      cents: cents,
      options: opciones,
      correctIndex: opciones.indexOf(cents),
      instructionKey: 'valueQuestion',
      hintKey: 'pistaMira',
      explanationKey: 'explicaValor'
    };
  }

  function countUp(id, pieces, opciones) {
    var total = pieces.reduce(function (sum, cents) { return sum + cents; }, 0);
    return {
      id: id,
      sceneMode: 'money-bundle',
      pieces: pieces,
      options: opciones,
      correctIndex: opciones.indexOf(total),
      instructionKey: 'countQuestion',
      hintKey: 'pistaCuenta',
      explanationKey: 'explicaCuenta'
    };
  }

  function equiv(id, targetCents, opciones) {
    return {
      id: id,
      sceneMode: 'money-equivalent',
      targetCents: targetCents,
      options: opciones,
      correctIndex: 0,
      targetLabelKey: 'equivalentTarget',
      instructionKey: 'equivalentQuestion',
      hintKey: 'pistaEquivalente',
      explanationKey: 'explicaEquivalente'
    };
  }

  function makePieces(values) {
    return { pieces: values };
  }

  function calcChange(id, paidCents, costCents, opciones) {
    var total = paidCents - costCents;
    return {
      id: id,
      sceneMode: 'money-change',
      paidCents: paidCents,
      costCents: costCents,
      options: opciones,
      correctIndex: opciones.indexOf(total),
      paidLabelKey: 'changePaid',
      priceLabelKey: 'changePrice',
      instructionKey: 'changeQuestion',
      hintKey: 'pistaCambio',
      explanationKey: 'explicaCambio'
    };
  }

  var CASES = [
      /* 1. Reconocer monedas y billetes. */
      recognize('es-1', 1, [1, 2, 5]),
      recognize('es-2', 2, [1, 2, 5]),
      recognize('es-5', 5, [2, 5, 10]),
      recognize('es-10', 10, [5, 10, 20]),
      recognize('es-20', 20, [10, 20, 50]),
      recognize('es-50', 50, [20, 50, 100]),
      recognize('es-100', 100, [50, 100, 200]),
      recognize('es-200', 200, [100, 200, 500]),
      recognize('es-500', 500, [200, 500, 1000]),
      recognize('es-1k', 1000, [500, 1000, 2000]),

      /* 2. Contar varias piezas, de menor a mayor. */
      countUp('es-count-1', [1, 1], [1, 2, 5]),
      countUp('es-count-2', [5, 5], [5, 10, 20]),
      countUp('es-count-3', [10, 20], [20, 30, 50]),
      countUp('es-count-4', [20, 50], [50, 70, 100]),
      countUp('es-count-5', [50, 50, 100], [100, 150, 200]),
      countUp('es-count-6', [100, 200], [200, 300, 500]),
      countUp('es-count-7', [500, 200, 100], [500, 800, 1000]),
      countUp('es-count-8', [1000, 500, 200], [1000, 1700, 2000]),

      /* 3. Formar el mismo valor con otras piezas. */
      equiv('es-eq-1', 20, [makePieces([10, 10]), makePieces([5, 5, 5]), makePieces([20, 5])]),
      equiv('es-eq-2', 50, [makePieces([20, 20, 10]), makePieces([20, 20]), makePieces([50, 10])]),
      equiv('es-eq-3', 100, [makePieces([50, 50]), makePieces([20, 20, 20, 20]), makePieces([50, 20, 20])]),
      equiv('es-eq-4', 200, [makePieces([100, 100]), makePieces([50, 50, 50]), makePieces([100, 50, 20])]),
      equiv('es-eq-5', 500, [makePieces([200, 200, 100]), makePieces([200, 200]), makePieces([100, 100, 100])]),

      /* 4. Calcular la vuelta, first con monedas y luego con billetes. */
      calcChange('es-change-1', 100, 50, [50, 20, 100]),
      calcChange('es-change-2', 200, 100, [100, 50, 200]),
      calcChange('es-change-3', 500, 200, [300, 200, 500]),
      calcChange('es-change-4', 1000, 600, [400, 300, 500]),
      calcChange('es-change-5', 2000, 800, [1200, 1000, 1500]),
      calcChange('es-change-6', 5000, 1700, [3300, 3000, 5000])
  ];

  /* rewardCents is 1200 (12,00 tokens) in both locales. */
  window.DATA = {
    cases: CASES,
    rewardCents: 1200
  };
})();
