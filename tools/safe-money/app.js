/* ==========================================================================
   tools/safe-money/app.js
   Activity: "Mi dinero está seguro" — practice recognising erroneous
   transfers and common scams (phishing, fake bank calls, urgent Bizum
   impersonation, fake resale listings) and choosing the right action.
   6 cases, Socratic help, +15 tokens on completion.
   ========================================================================== */
(function () {
  'use strict';

  App.activity.run({
    slug: 'safe-money',
    rewardCents: 1500,
    cases: [
      {
        id: 'sm1',
        instructionKey: 's1instr',
        sceneHtml: '<p>📩 <strong>+50,00 €</strong><br>Bizum recibido<br>De: número desconocido</p>',
        options: ['opLlamarBanco', 'opGastar', 'opDevolver'],
        correctIndex: 0,
        hintKey: 's1pista',
        explanationKey: 's1expl'
      },
      {
        id: 'sm2',
        instructionKey: 's2instr',
        sceneHtml: '<p>📤 Bizum enviado<br>Para: 612 345 678<br>Importe: 100,00 €</p>',
        options: ['opLlamarBanco', 'opPedirMas', 'opNoGastar'],
        correctIndex: 0,
        hintKey: 's2pista',
        explanationKey: 's2expl'
      },
      {
        id: 'sm3',
        instructionKey: 's3instr',
        sceneHtml: '<p>📩 SMS de "Banco"<br>"Verifica tu cuenta aquí:<br>🔗 bbanco-seguro.info"</p>',
        options: ['opBorrar', 'opPinchar', 'opLlamarBanco'],
        correctIndex: 0,
        hintKey: 's3pista',
        explanationKey: 's3expl'
      },
      {
        id: 'sm4',
        instructionKey: 's4instr',
        sceneHtml: '<p>📞 "Hola, soy de tu banco.<br>Necesito tus claves<br>para proteger tu cuenta."</p>',
        options: ['opCortar', 'opDecirClaves', 'opSeguirLlamada'],
        correctIndex: 0,
        hintKey: 's4pista',
        explanationKey: 's4expl'
      },
      {
        id: 'sm5',
        instructionKey: 's5instr',
        sceneHtml: '<p>📱 WhatsApp<br>"Soy tu primo. Estoy<br>en un problema. ¿Me<br>mandas 200 € ya?"</p>',
        options: ['opLlamarFamiliar', 'opPagarRapido', 'opPedirMas'],
        correctIndex: 0,
        hintKey: 's5pista',
        explanationKey: 's5expl'
      },
      {
        id: 'sm6',
        instructionKey: 's6instr',
        sceneHtml: '<p>📱 Móvil nuevo, 200 €<br>(vale 600 € nuevo)<br>"Solo hoy. Adelanto<br>por Bizum y te lo envío."</p>',
        options: ['opQuedarBanco', 'opPagarAdelanto', 'opComprarYa'],
        correctIndex: 0,
        hintKey: 's6pista',
        explanationKey: 's6expl'
      }
    ]
  });
})();
