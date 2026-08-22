/* tools/needs-vs-wants — Activity: ¿Es una necesidad o un deseo?
   Each case shows a scenario and asks the person to classify it.
   3 options, socratic help, +8 tokens on completion. */
(function () {
  'use strict';
  App.activity.run({
    slug: 'needs-vs-wants',
    rewardCents: 800,
    casos: [
      { id: 'w1', escenaHtml: '<p>🍎🍞</p>',
        opciones: ['opNecesito', 'opQuiero', 'opAmbos'],
        correctaIndex: 0,
        pistaKey: 'pistaComida', explicacionKey: 'explComida' },
      { id: 'w2', escenaHtml: '<p>📺</p>',
        opciones: ['opNecesito', 'opQuiero', 'opAmbos'],
        correctaIndex: 1,
        pistaKey: 'pistaOcio', explicacionKey: 'explOcio' },
      { id: 'w3', escenaHtml: '<p>💊</p>',
        opciones: ['opNecesito', 'opQuiero', 'opAmbos'],
        correctaIndex: 0,
        pistaKey: 'pistaSalud', explicacionKey: 'explSalud' },
      { id: 'w4', escenaHtml: '<p>🎮</p>',
        opciones: ['opNecesito', 'opQuiero', 'opAmbos'],
        correctaIndex: 1,
        pistaKey: 'pistaOcio', explicacionKey: 'explOcio' },
      { id: 'w5', escenaHtml: '<p>🧥</p>',
        opciones: ['opNecesito', 'opQuiero', 'opAmbos'],
        correctaIndex: 2,
        pistaKey: 'pistaRopa', explicacionKey: 'explRopa' },
      { id: 'w6', escenaHtml: '<p>🏠</p>',
        opciones: ['opNecesito', 'opQuiero', 'opAmbos'],
        correctaIndex: 0,
        pistaKey: 'pistaHogar', explicacionKey: 'explHogar' },
      { id: 'w7', escenaHtml: '<p>🍫</p>',
        opciones: ['opNecesito', 'opQuiero', 'opAmbos'],
        correctaIndex: 1,
        pistaKey: 'pistaOcio', explicacionKey: 'explOcio' },
      { id: 'w8', escenaHtml: '<p>📚</p>',
        opciones: ['opNecesito', 'opQuiero', 'opAmbos'],
        correctaIndex: 2,
        pistaKey: 'pistaEstudiar', explicacionKey: 'explEstudiar' }
    ]
  });
})();
