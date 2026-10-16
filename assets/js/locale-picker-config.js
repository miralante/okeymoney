/* ==========================================================================
   Okeymoney — Locale picker configuration.
   Must be an external file, not an inline <script>: the CSP in `_headers`
   is `script-src 'self'` with no `unsafe-inline`, so the browser blocked
   the inline block and window.LocalePickerConfig stayed undefined. The
   component then fell back to its own defaults, which cost the app two
   real things: the "Más ajustes" link to config/ never rendered (the
   picker's own drawer looked like the only settings UI), and the locale
   was written to the shared `apptonomia:locale` key instead of
   `okeymoney:locale`, so it did not read back what assets/js/i18n.js uses.
   Same reason assets/js/sw-register.js is an external file.
   Loaded without `defer`, so it runs before the deferred
   assets/js/locale-picker.js, exactly like the inline block it replaces.

   No `settingsHref`: the drawer's "more settings" link is gone. Okeymoney
   already reaches config/ from its own navigation, and a second link to the
   same page inside another control was a duplicated setting.
   ========================================================================== */
window.LocalePickerConfig = {
  /* El selector de idioma va DENTRO del cajón del ⚙️, como primera
     fila, y el ⚙️ se queda solo en la cabecera. Antes vivía al lado
     del ⚙️ en la fila de controles y eran dos sitios donde cambiar
     preferencias. Coste: un clic más para llegar al idioma. */
  languageInDrawer: true,
  storageKey: 'okeymoney:locale',
  /* Okeymoney stores strings next to index.html (not under assets/js/),
     so discovery is skipped: no HEAD probes (each one was a 404), and
     requiredLocales names the two locales actually shipped. */
  path: null,
  requiredLocales: ['es', 'en'],
  defaultLocale: 'en'
};
