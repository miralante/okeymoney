/* tools/before-buying — Four calm questions before a purchase.
   Adapted as an original learning activity from the linked Preahorro idea. */
(function () {
  'use strict';
  App.activity.run({
    slug: 'before-buying',
    rewardCents: 1000,
    cases: [
      { id: 'q1', instructionKey: 'q1instr', sceneHtml: '<p>📱 Un móvil nuevo te llama la atención.</p>',
        options: ['opNeed', 'opWant', 'opNotSure'], correctIndex: 1,
        hintKey: 'q1hint', explanationKey: 'q1expl' },
      { id: 'q2', instructionKey: 'q2instr', sceneHtml: '<p>🚲 La compra cuesta más de lo que tienes reservado.</p>',
        options: ['opBuyNow', 'opBorrow', 'opWait'], correctIndex: 2,
        hintKey: 'q2hint', explanationKey: 'q2expl' },
      { id: 'q3', instructionKey: 'q3instr', sceneHtml: '<p>🎧 Encuentras unos auriculares que te gustan.</p>',
        options: ['opCompare', 'opBuyNow', 'opSkip'], correctIndex: 0,
        hintKey: 'q3hint', explanationKey: 'q3expl' },
      { id: 'q4', instructionKey: 'q4instr', sceneHtml: '<p>🎮 Piensas en comprar un juego por impulso.</p>',
        options: ['opFeelGood', 'opThinkLong', 'opNoThink'], correctIndex: 1,
        hintKey: 'q4hint', explanationKey: 'q4expl' }
    ]
  });
})();
