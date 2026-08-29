/* tools/safe-money — Texts (ES) */
(function () {
  'use strict';
  App.i18n.register({
    title: 'Protege tu dinero',
    metaDescription: 'Aprende a reconocer transferencias erróneas y estafas, y cómo actuar.',
    objetivo: 'Objetivo: detectar riesgos y elegir una acción segura antes de mover dinero.',
    instruccion: 'Lee la situación y elige qué harías.',

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
    s1expl: 'No gastes ese dinero ni lo devuelvas tú al número que te ha escrito: avisa a tu banco. Ellos localizarán al dueño real y lo devolverán si es un error. Si lo gastas, podrías tener que devolverlo de tu bolsillo.',
    s2expl: 'Llama a tu banco cuanto antes, en horario o al teléfono de incidencias 24h. Cuanto antes avises, más fácil es recuperar el dinero o bloquear la operación.',
    s3expl: 'Los bancos nunca te envían enlaces por SMS para "verificar" nada. Es phishing: borra el mensaje y, si dudas, llama tú al banco con el número de la tarjeta.',
    s4expl: 'El banco de verdad ya sabe tu nombre, tu DNI y tu número de cuenta. Nadie necesita tus claves para "verificarte": cuelga y avisa a tu familia o al banco oficial.',
    s5expl: 'Aunque la historia parezca real, es muy habitual que alguien suplante a un familiar. Cuelga y llama tú a esa persona por el número que ya tenías: si no te localiza esa persona, era mentira.',
    s6expl: 'En compras entre particulares, paga siempre en persona y por métodos que se puedan anular (nunca transferencia directa a un desconocido). Una ganga enorme que "se agota" suele ser la señal de una estafa.',

    /* Generic */
    pistaSigue: 'Vuelve a leer la situación con calma.',
    completado: '¡Muy bien! Ya sabes cuidar tu dinero.',
    reiniciar: '↻ Jugar otra vez',
    fallo: 'Casi. Vuelve a leer la situación con calma.',
    yaCompletada: 'Ya has terminado esta actividad.'
  }, 'es');
})();
