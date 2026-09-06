/* tools/safe-money — Texts (ES) */
(function () {
  'use strict';
  App.i18n.register({
    title: 'Protege tu dinero',
    metaDescription: 'Reconoce transferencias extrañas y estafas, y decide cómo actuar.',
    objetivo: 'Cuando algo no cuadra, detecta el riesgo antes de mover dinero.',
    instruccion: 'Lee la situación y elige qué harías.',
    didacticTitle: 'Para si algo parece raro',
    didacticBody: 'No compartas claves ni códigos. Comprueba quién pide tu dinero.',
    didacticExampleLabel: 'Ejemplo',
    didacticExample: 'Si recibes un SMS urgente, no abras el enlace. Llama a tu banco.',
    didacticContinue: 'Probar situaciones',

    /* Common scenario verbs (the scene prompts) */
    s1instr: 'Te ha llegado un Bizum de 50 € que no esperabas. ¿Qué haces?',
    s2instr: 'Has enviado 100 € al número equivocado por error. ¿Qué haces?',
    s3instr: 'Recibes un SMS del "banco" con un enlace para "verificar tu cuenta". ¿Qué haces?',
    s4instr: 'Te llaman diciendo que son del banco y te piden tus claves. ¿Qué haces?',
    s5instr: 'Un "familiar" te pide un Bizum urgente por un problema. ¿Qué haces?',
    s6instr: 'Vas a comprar un móvil de segunda mano por Wallapop. ¿Qué haces?',

    /* Option keys (reused across cases) */
    opLlamarBanco: '📞 Llamo a mi banco antes de nada',
    opNoGastar: '🚫 No lo gasto y no lo envío de vuelta',
    opGastar: '💸 Lo gasto en algo que quiero',
    opDevolver: '↩️ Lo devuelvo al número que me escribió',
    opAvisar: '🗣️ Cuelgo y aviso a mi familia',
    opSeguirLlamada: '🗣️ Sigo hablando para comprobar que es el banco',
    opCortar: '🚫 Cuelgo y no digo mis claves',
    opDecirClaves: '🔑 Digo mis claves para "verificarme"',
    opPinchar: '🔗 Pincho en el enlace para ver qué dice',
    opBorrar: '🗑️ Borro el SMS y aviso a mi banco',
    opPagarRapido: '💸 Pago rápido antes de que se acabe la oferta',
    opLlamarFamiliar: '📞 Llamo a ese familiar por otro lado para confirmar',
    opPedirMas: '💸 Le envío más dinero si me lo pide',
    opPagarAdelanto: '💸 Pago un adelanto para "reservarlo"',
    opQuedarBanco: '🏦 Quedo en persona y pago en el banco',
    opComprarYa: '✅ Lo compro ya antes de que se lo lleven',

    /* Hints — first mistake */
    s1pista: 'Un dinero que no esperabas puede ser un error de otra persona. Lo primero es hablar con tu banco, no gastarlo.',
    s2pista: 'Si has enviado dinero por error, el tiempo cuenta: avisa al banco cuanto antes.',
    s3pista: 'Los bancos nunca piden verificar nada por SMS con un enlace. Desconfía y comprueba por tu cuenta.',
    s4pista: 'Tu banco de verdad ya tiene tus datos. Nunca te pedirá las claves por teléfono.',
    s5pista: 'Aunque parezca urgente, lo primero es comprobar que es quien dice ser, por otro camino.',
    s6pista: 'Las gangas demasiado buenas suelen ser una trampa. Mejor quedar en persona y pagar seguro.',

    /* Explanations — second mistake */
    s1expl: 'No gastes ese dinero. No lo devuelvas al número que te ha escrito. Avisa a tu banco. Si lo gastas, quizá tengas que devolverlo tú.',
    s2expl: 'Avisa a tu banco cuanto antes. Así será más fácil recuperar el dinero o parar el pago.',
    s3expl: 'Los bancos no envían enlaces por SMS para comprobar tus datos. Borra el mensaje. Si dudas, llama tú al banco con el número de tu tarjeta.',
    s4expl: 'Tu banco ya tiene tus datos. No necesita tus claves. Cuelga y llama tú al banco con su número oficial.',
    s5expl: 'Puede que no sea tu familiar. Cuelga y llama tú a esa persona con el número que ya tenías.',
    s6expl: 'En una compra a otra persona, queda en un lugar seguro y no envíes dinero por adelantado. Una oferta demasiado buena puede ser una estafa.',

    /* Generic */
    pistaSigue: 'Vuelve a leer la situación con calma.',
    completado: '¡Muy bien! Ya sabes cuidar tu dinero.',
    reiniciar: '↻ Volver a hacerlo',
    fallo: 'Casi. Vuelve a leer la situación con calma.',
    yaCompletada: 'Ya has hecho esta situación. Puedes volver a hacerla.'
  }, 'es');
})();
