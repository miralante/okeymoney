/* tools/my-shopping-day — Mi compra del día (integradora).
   5 rondas que combinan todo: identificar moneda, distinguir
   necesidad/deseo, priorizar compra, calcular vuelta y guardar para una
   meta. +60 tokens.

   Las claves i18n viven bajo d1/d2/d3/d4 (en strings.<locale>.js).
   Antes usaban m1..m4 que nunca se llegaron a registrar, así que el
   runtime pintaba las claves en crudo. Este cambio reusa las d1..d4
   existentes en lugar de duplicar las frases. */
(function () {
  'use strict';
  App.activity.run({
    slug: 'my-shopping-day',
    rewardCents: 6000,
    casos: [
      { id: 'd1',
        instruccionKey: 'd1instr',
        sceneMode: 'money-token', cents: 1000,
        opciones: ['op1e', 'op5e', 'op10e'],
        correctaIndex: 2,
        pistaKey: 'd1pista', explicacionKey: 'd1expl' },
      { id: 'd2',
        instruccionKey: 'd2instr',
        escenaHtml: '<p>🥖 2 € &nbsp; 🎮 30 €</p>',
        opciones: ['opNecesito', 'opQuiero'],
        correctaIndex: 0,
        pistaKey: 'd2pista', explicacionKey: 'd2expl' },
      { id: 'd3',
        instruccionKey: 'd3instr',
        escenaHtml: '<p>Tienes 4 €: 🎮 20 € &nbsp; 🩹 2 € &nbsp; 🍞 2 €</p>',
        opciones: ['opJuego', 'opTiritasPan', 'opJuegoTiritas'],
        correctaIndex: 1,
        pistaKey: 'd3pista', explicacionKey: 'd3expl' },
      { id: 'd4',
        instruccionKey: 'd4instr',
        escenaHtml: '<p>Pagas con 5 € y la compra vale 2,30 €</p>',
        opciones: ['op2e70', 'op3e70', 'op1e30'],
        correctaIndex: 0,
        pistaKey: 'd4pista', explicacionKey: 'd4expl' },
      { id: 'd5',
        instruccionKey: 'd5instr',
        escenaHtml: '<p>Tienes 10 € y quieres ahorrar para unos auriculares.</p>',
        opciones: ['opGuardar0', 'opGuardar2', 'opGuardar10'],
        correctaIndex: 1,
        pistaKey: 'd5pista', explicacionKey: 'd5expl' }
    ]
  });
})();
