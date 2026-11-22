/* Okeymoney — textos de «Borrar los datos de la persona», en español. Página de apoyo:
   no aparece en el menú de la aplicación. */
window.App = window.App || {};
if (window.App.i18n) {
  App.i18n.register({
    personal: {
      title: 'Borrar los datos de la persona',
      routeNotice: 'Página de ajustes. No aparece en el menú de la aplicación: solo se llega escribiendo esta dirección.',
      intro: 'Borra el tamaño del texto y la preferencia de idioma. Se conservan el saldo, los movimientos, las metas y los compromisos.',
      button: 'Borrar mis datos personales',
      confirm: 'Toca otra vez para confirmar',
      done: 'Hecho. El idioma se ha restablecido a Español y el tamaño de letra a normal.'
    }
  }, 'es');
}
