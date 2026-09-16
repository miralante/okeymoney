/* tools/my-shopping-day — Mi compra del día (integradora).
   5 rondas que combinan todo: identificar moneda, distinguir
   necesidad/deseo, priorizar compra, calcular vuelta y save para una
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
    cases: [
      { id: 'd1',
        instructionKey: 'd1instr',
        sceneMode: 'money-token', cents: 1000,
        options: ['op1e', 'op5e', 'op10e'],
        correctIndex: 2,
        hintKey: 'd1pista', explanationKey: 'd1expl' },
      { id: 'd2',
        instructionKey: 'd2instr',
        sceneKey: 'reviewScene1',
        options: ['opNecesito', 'opQuiero'],
        correctIndex: 0,
        hintKey: 'd2pista', explanationKey: 'd2expl' },
      { id: 'd3',
        instructionKey: 'd3instr',
        sceneKey: 'reviewScene2',
        options: ['opJuego', 'opTiritasPan', 'opJuegoTiritas'],
        correctIndex: 1,
        hintKey: 'd3pista', explanationKey: 'd3expl' },
      { id: 'd4',
        instructionKey: 'd4instr',
        sceneKey: 'reviewScene3',
        options: ['op2e70', 'op3e70', 'op1e30'],
        correctIndex: 0,
        hintKey: 'd4pista', explanationKey: 'd4expl' },
      { id: 'd5',
        instructionKey: 'd5instr',
        sceneKey: 'reviewScene4',
        options: ['opGuardar0', 'opGuardar2', 'opGuardar10'],
        correctIndex: 1,
        hintKey: 'd5pista', explanationKey: 'd5expl' }
    ]
  });
})();
