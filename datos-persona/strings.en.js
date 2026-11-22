/* Okeymoney — «Erase the person's data» texts, in English. Support page:
   it does not appear in the app menu. */
window.App = window.App || {};
if (window.App.i18n) {
  App.i18n.register({
    personal: {
      title: 'Erase the person’s data',
      routeNotice: 'Settings page. It is not in the app menu: you only get here by typing this address.',
      intro: 'Clears the text size and the language preference. Balance, movements, goals and commitments are kept.',
      button: 'Erase my personal data',
      confirm: 'Tap again to confirm',
      done: 'Done. The language is back to Spanish and the text size to normal.'
    }
  }, 'en');
}
