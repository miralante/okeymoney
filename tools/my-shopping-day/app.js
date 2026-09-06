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
    shuffleCases: false,
    casos: [
      { id: 'd1',
        instruccionKey: 'd1instr',
        sceneMode: 'money-token', cents: 1000,
        opciones: ['op1e', 'op5e', 'op10e'],
        correctaIndex: 2,
        pistaKey: 'd1pista', explicacionKey: 'd1expl' },
      { id: 'd2',
        instruccionKey: 'd2instr',
        sceneKey: 'reviewScene1',
        opciones: ['opNecesito', 'opQuiero'],
        correctaIndex: 0,
        pistaKey: 'd2pista', explicacionKey: 'd2expl' },
      { id: 'd3',
        instruccionKey: 'd3instr',
        sceneKey: 'reviewScene2',
        opciones: ['opJuego', 'opTiritasPan', 'opJuegoTiritas'],
        correctaIndex: 1,
        pistaKey: 'd3pista', explicacionKey: 'd3expl' },
      { id: 'd4',
        instruccionKey: 'd4instr',
        sceneKey: 'reviewScene3',
        opciones: ['op2e70', 'op3e70', 'op1e30'],
        correctaIndex: 0,
        pistaKey: 'd4pista', explicacionKey: 'd4expl' },
      { id: 'd5',
        instruccionKey: 'd5instr',
        sceneKey: 'reviewScene4',
        opciones: ['opGuardar0', 'opGuardar2', 'opGuardar10'],
        correctaIndex: 1,
        pistaKey: 'd5pista', explicacionKey: 'd5expl' }
    ]
  });
})();
