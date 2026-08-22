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
    casos: [
      {
        id: 'sm1',
        instruccionKey: 's1instr',
        escenaHtml: '<p>📩 <strong>+50,00 €</strong><br>Bizum recibido<br>De: número desconocido</p>',
        opciones: ['opLlamarBanco', 'opGastar', 'opDevolver'],
        correctaIndex: 0,
        pistaKey: 's1pista',
        explicacionKey: 's1expl'
      },
      {
        id: 'sm2',
        instruccionKey: 's2instr',
        escenaHtml: '<p>📤 Bizum enviado<br>Para: 612 345 678<br>Importe: 100,00 €</p>',
        opciones: ['opLlamarBanco', 'opPedirMas', 'opNoGastar'],
        correctaIndex: 0,
        pistaKey: 's2pista',
        explicacionKey: 's2expl'
      },
      {
        id: 'sm3',
        instruccionKey: 's3instr',
        escenaHtml: '<p>📩 SMS de "Banco"<br>"Verifica tu cuenta aquí:<br>🔗 bbanco-seguro.info"</p>',
        opciones: ['opBorrar', 'opPinchar', 'opLlamarBanco'],
        correctaIndex: 0,
        pistaKey: 's3pista',
        explicacionKey: 's3expl'
      },
      {
        id: 'sm4',
        instruccionKey: 's4instr',
        escenaHtml: '<p>📞 "Hola, soy de tu banco.<br>Necesito tus claves<br>para proteger tu cuenta."</p>',
        opciones: ['opCortar', 'opDecirClaves', 'opAvisar'],
        correctaIndex: 0,
        pistaKey: 's4pista',
        explicacionKey: 's4expl'
      },
      {
        id: 'sm5',
        instruccionKey: 's5instr',
        escenaHtml: '<p>📱 WhatsApp<br>"Soy tu primo. Estoy<br>en un problema. ¿Me<br>mandas 200 € ya?"</p>',
        opciones: ['opLlamarFamiliar', 'opPagarRapido', 'opPedirMas'],
        correctaIndex: 0,
        pistaKey: 's5pista',
        explicacionKey: 's5expl'
      },
      {
        id: 'sm6',
        instruccionKey: 's6instr',
        escenaHtml: '<p>📱 Móvil nuevo, 200 €<br>(vale 600 € nuevo)<br>"Solo hoy. Adelanto<br>por Bizum y te lo envío."</p>',
        opciones: ['opQuedarBanco', 'opPagarAdelanto', 'opComprarYa'],
        correctaIndex: 0,
        pistaKey: 's6pista',
        explicacionKey: 's6expl'
      }
    ]
  });
})();
