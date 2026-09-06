/* ============================================================
   Okeymoney — Settings texts (EN)
   Parity with strings.es.js (enforced by scripts/check.js).
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    title: '⚙️ Okeymoney — Settings',
    routeNotice: 'Settings page. It does not appear in the app menu: you get here by typing this address.',
    intro: 'Here you can clear what is saved in this browser. Aimed at whoever manages the device (family, professionals), not at the person using the app.',

    stateTitle: 'Current state of this browser',
    currentLanguage: 'Current language: {lang}',
    languageNameEs: 'Spanish',
    languageNameEn: 'English',
    balanceCurrent: 'Saved balance: {amount}',
    movementsCount: 'Saved movements: {n}',
    goalsCount: 'Saved goals: {n}',
    commitmentsCount: 'Saved commitments: {n}',
    practiceTokens: 'Practice points: {n}',

    personalDataTitle: "Clear the person's data",
    personalDataIntro: 'Clears the text size and the language preference.',
    personalDataKeeps: 'Kept',
    btnResetPersonal: "Clear my personal data",
    confirmResetPersonal: 'Tap again to confirm',
    feedbackResetPersonalDone: 'Done. Language reset to Spanish and text size to normal.',

    wipeTitle: 'Clear everything',
    wipeIntro: 'Clears every key under okeymoney:: balance, movements, goals, commitments, preferences and language. Equivalent to opening the app for the first time.',
    btnResetAll: 'Clear everything saved',
    confirmResetAll: 'Tap again to confirm',
    feedbackResetAllDone: 'Done. Everything saved in this browser has been cleared.',

    footer: 'Nothing leaves this browser. There is no account, no server, no cloud backup.'
  });
})();
