/* ============================================================
   Okeymoney — Textos de Ajustes (ES)
   Archivo específico del idioma. Se carga condicionalmente
   desde index.html según App.i18n.locale().
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    title: '⚙️ Okeymoney — Ajustes',
    routeNotice: 'Página de ajustes. No aparece en el menú de la aplicación: solo se llega escribiendo esta dirección.',
    intro: 'Aquí se puede borrar lo guardado en este navegador. Pensada para quien gestiona el dispositivo (familia, profesionales), no para la persona usuaria.',

    stateTitle: 'Estado actual de este navegador',
    currentLanguage: 'Idioma actual: {lang}',
    languageNameEs: 'Español',
    languageNameEn: 'English',
    balanceCurrent: 'Saldo guardado: {amount}',
    movementsCount: 'Movimientos guardados: {n}',
    goalsCount: 'Metas guardadas: {n}',
    commitmentsCount: 'Compromisos guardados: {n}',
    practiceTokens: 'Puntos de práctica: {n}',

    personalDataTitle: 'Borrar los datos de la persona',
    personalDataIntro: 'Borra el tamaño del texto y la preferencia de idioma.',
    personalDataKeeps: 'Se conservan',
    btnResetPersonal: 'Borrar mis datos personales',
    confirmResetPersonal: 'Toca otra vez para confirmar',
    feedbackResetPersonalDone: 'Hecho. El idioma se ha restablecido a Español y el tamaño de letra a normal.',

    wipeTitle: 'Borrar todo',
    wipeIntro: 'Borra todas las claves bajo okeymoney:: saldo, movimientos, metas, compromisos, preferencias e idioma. Equivale a abrir la app por primera vez.',
    btnResetAll: 'Borrar todo lo guardado',
    confirmResetAll: 'Toca otra vez para confirmar',
    feedbackResetAllDone: 'Hecho. Se ha borrado todo lo guardado en este navegador.',

    footer: 'Nada sale de este navegador. No hay cuenta, ni servidor, ni copia de seguridad en la nube.'
  });
})();
