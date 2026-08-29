/* tools/before-buying — Four calm questions before a purchase.
   Adapted as an original learning activity from the linked Preahorro idea. */
(function () {
  'use strict';
  App.activity.run({
    slug: 'before-buying',
    rewardCents: 1000,
    casos: [
      { id: 'q1', instruccionKey: 'q1instr', escenaHtml: '<p>📱 Un móvil nuevo te llama la atención.</p>',
        opciones: ['opNeed', 'opWant', 'opNotSure'], correctaIndex: 1,
        pistaKey: 'q1hint', explicacionKey: 'q1expl' },
      { id: 'q2', instruccionKey: 'q2instr', escenaHtml: '<p>🚲 La compra cuesta más de lo que tienes reservado.</p>',
        opciones: ['opBuyNow', 'opBorrow', 'opWait'], correctaIndex: 2,
        pistaKey: 'q2hint', explicacionKey: 'q2expl' },
      { id: 'q3', instruccionKey: 'q3instr', escenaHtml: '<p>🎧 Encuentras unos auriculares que te gustan.</p>',
        opciones: ['opCompare', 'opBuyNow', 'opSkip'], correctaIndex: 0,
        pistaKey: 'q3hint', explicacionKey: 'q3expl' },
      { id: 'q4', instruccionKey: 'q4instr', escenaHtml: '<p>🎮 Piensas en comprar un juego por impulso.</p>',
        opciones: ['opFeelGood', 'opThinkLong', 'opNoThink'], correctaIndex: 1,
        pistaKey: 'q4hint', explicacionKey: 'q4expl' }
    ]
  });
})();
