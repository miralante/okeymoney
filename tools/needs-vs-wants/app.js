/* tools/needs-vs-wants — Activity: ¿Es una necesidad o un deseo?
   Each case shows a scenario and asks the person to classify it.
   3 options, socratic help, +8 tokens on completion. */
(function () {
  'use strict';
  App.activity.run({
    slug: 'needs-vs-wants',
    rewardCents: 800,
    casos: [
      { id: 'w1', escenaHtml: '<p>🍎🍞 Comprar la comida básica de la semana.</p>',
        opciones: ['opNecesito', 'opQuiero', 'opAmbos'],
        correctaIndex: 0,
        pistaKey: 'pistaComida', explicacionKey: 'explComida' },
      { id: 'w2', escenaHtml: '<p>📺 Comprar una tele nueva aunque la actual funciona.</p>',
        opciones: ['opNecesito', 'opQuiero', 'opAmbos'],
        correctaIndex: 1,
        pistaKey: 'pistaOcio', explicacionKey: 'explOcio' },
      { id: 'w3', escenaHtml: '<p>💊 Comprar el medicamento recetado.</p>',
        opciones: ['opNecesito', 'opQuiero', 'opAmbos'],
        correctaIndex: 0,
        pistaKey: 'pistaSalud', explicacionKey: 'explSalud' },
      { id: 'w4', escenaHtml: '<p>🎮 Comprar un juego para divertirte.</p>',
        opciones: ['opNecesito', 'opQuiero', 'opAmbos'],
        correctaIndex: 1,
        pistaKey: 'pistaOcio', explicacionKey: 'explOcio' },
      { id: 'w5', escenaHtml: '<p>🧥 Comprar un abrigo para el frío y elegir uno de tu estilo.</p>',
        opciones: ['opNecesito', 'opQuiero', 'opAmbos'],
        correctaIndex: 2,
        pistaKey: 'pistaRopa', explicacionKey: 'explRopa' },
      { id: 'w6', escenaHtml: '<p>🏠 Pagar el alquiler de tu casa.</p>',
        opciones: ['opNecesito', 'opQuiero', 'opAmbos'],
        correctaIndex: 0,
        pistaKey: 'pistaHogar', explicacionKey: 'explHogar' },
      { id: 'w7', escenaHtml: '<p>🍫 Comprar chocolate porque te apetece.</p>',
        opciones: ['opNecesito', 'opQuiero', 'opAmbos'],
        correctaIndex: 1,
        pistaKey: 'pistaOcio', explicacionKey: 'explOcio' },
      { id: 'w8', escenaHtml: '<p>📚 Comprar un libro extra porque te interesa.</p>',
        opciones: ['opNecesito', 'opQuiero', 'opAmbos'],
        correctaIndex: 1,
        pistaKey: 'pistaEstudiar', explicacionKey: 'explEstudiar' }
    ]
  });
})();
