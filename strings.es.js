/* Okeymoney — Textos en español (idioma por defecto y fuente de verdad). */
(function () {
  'use strict';
  App.i18n.register({
    title: 'Okeymoney',
    appName: 'Okeymoney',

    agent: {
      persona: 'Persona',
      empresa: 'Empresa',
      banco: 'Banco'
    },

    meta: {
      description: 'Aprende a manejar tu dinero: cuánto tienes, cuánto gastas y cuánto ahorras.'
    },

    tabs: {
      home: 'Mi dinero',
      goals: 'Mis metas',
      learn: 'Aprender',
      newExpenseAria: 'Apuntar un gasto'
    },

    home: {
      saludo: 'Hola. ¿Qué quieres hacer hoy?',
      moreGoals: '+{n} más',
      anchorAria: 'Ir a {theme}',
      balanceLabel: 'Tienes',
      editBalanceAria: 'Cambiar cuánto dinero tienes',
      editHint: 'Toca para cambiar cuánto dinero tienes',
      setBalanceTitle: '¿Cuánto dinero tienes?',
      setBalanceInstruction: 'Cuenta tu dinero y escribe cuánto tienes ahora.',
      catalogueTitle: 'Aprende con Okeymoney'
    },

    expense: {
      categoryTitle: '¿En qué gastaste?',
      categoryInstruction: 'Elige un dibujo.',
      amountTitle: '¿Cuánto gastaste?',
      amountInstruction: 'Escribe el precio.',
      confirmTitle: 'Revisa tu gasto',
      confirmInstruction: 'Si está bien, guárdalo.',
      saveButton: '✅ Guardar gasto',
      savedMessage: '¡Gasto guardado!'
    },

    categories: {
      food: 'Comida',
      fun: 'Ocio',
      transport: 'Transporte',
      clothes: 'Ropa',
      health: 'Salud',
      other: 'Otros'
    },

    goals: {
      title: 'Mis metas',
      newButton: '+ Nueva meta',
      empty: 'Todavía no tienes ninguna meta. ¡Crea la primera!',
      newTitle: '¿Qué quieres conseguir?',
      newInstruction: 'Elige un dibujo y escribe el nombre.',
      namePlaceholder: 'Por ejemplo: un juego',
      nameAria: 'Nombre de tu meta',
      targetTitle: '¿Cuánto cuesta?',
      targetInstruction: 'Escribe el precio.',
      addTitle: '¿Cuánto quieres guardar?',
      addInstruction: 'Escribe la cantidad.',
      addButton: '+ Añadir dinero',
      progressText: '{saved} de {target}',
      achievedBadge: '🏆 ¡Meta conseguida!',
      savedMessage: '¡Meta creada!',
      addedMessage: '¡Dinero guardado!'
    },

    learn: {
      title: 'Aprender',
      comingSoon: 'Muy pronto podrás practicar aquí con juegos sobre el dinero.',
      walletLabel: 'Tu monedero de práctica',
      intro: 'Gana 🪙 practicando con actividades. Tu monedero de práctica es independiente del dinero real.',
      stateDone: '✓ Hecha',
      stateAvailable: '▶ Empezar',
      stateLocked: '🔒 Pronto',
      themes: {
        concepts: 'Conceptos básicos',
        daily: 'Vida cotidiana',
        safety: 'Seguridad'
      },
      activityTitle: {
        'concepts-money':  '¿Qué es el dinero?',
        'needs-vs-wants':  'Necesito o quiero',
        'budget-first':    '¿Qué compro primero?',
        'go-shopping':     'Ir a la tienda',
        'change-back':     'Calcular la vuelta',
        'my-shopping-day': 'Mi compra del día',
        'safe-money':      'Mi dinero está seguro'
      },
      activityDesc: {
        'concepts-money':  'Identifica monedas y billetes por su valor.',
        'needs-vs-wants':  'Distingue lo que necesitas de lo que deseas.',
        'budget-first':    'Decide qué comprar antes con un dinero limitado.',
        'go-shopping':     'Haz una compra pequeña con un presupuesto.',
        'change-back':     'Calcula cuánto te tienen que devolver al pagar.',
        'my-shopping-day': 'Practica todo junto en una compra completa.',
        'safe-money':      'Reconoce transferencias raras y estafas, y qué hacer.'
      }
    },

    wizard: {
      closeAria: 'Cerrar y no guardar'
    },

    keypad: {
      deleteDigit: 'Borrar el último dígito',
      clear: 'Borrar todo'
    },

    offline: {
      title: 'Sin conexión',
      heading: 'Sin conexión',
      body: 'No hemos podido cargar esta página. Comprueba tu conexión a Internet y vuelve a intentarlo.',
      homeLink: 'Volver a Okeymoney',
      metaDescription: 'Okeymoney está sin conexión: comprueba tu conexión a Internet y vuelve a intentarlo.'
    }
  }, 'es');
})();
