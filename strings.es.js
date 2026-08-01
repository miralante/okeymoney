/* Okeymoney — Textos en español (idioma por defecto y fuente de verdad). */
(function () {
  'use strict';
  App.i18n.register({
    title: 'Okeymoney',

    tabs: {
      home: 'Mi dinero',
      goals: 'Mis metas',
      learn: 'Aprender',
      newExpenseAria: 'Apuntar un gasto'
    },

    home: {
      balanceLabel: 'Tienes',
      editBalanceAria: 'Cambiar cuánto dinero tienes',
      editHint: 'Toca el número para cambiarlo',
      recentTitle: 'Tus últimos movimientos',
      recentEmpty: 'Todavía no has apuntado ningún gasto.',
      setBalanceTitle: '¿Cuánto dinero tienes?',
      setBalanceInstruction: 'Cuenta tu dinero y escribe cuánto tienes ahora.'
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
      teaser: {
        change: '🪙 Calcular la vuelta',
        budget: '📋 Hacer un presupuesto',
        needsWants: '🤔 Lo que necesito y lo que quiero'
      }
    },

    wizard: {
      closeAria: 'Cerrar y no guardar'
    }
  }, 'es');
})();
