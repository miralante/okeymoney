/* ============================================================
   Okeymoney — Locale-neutral data.
   NO logic or UI text here — names live in strings.es.js / strings.en.js
   under matching keys (categories.<id>, learn.teaser.<id>).

   - categories: expense categories shown as icon buttons in step 1 of
     "Registrar un gasto". Kept to 6 max (accessibility rule: 4-6 options
     per screen).
   - goalIcons: icon choices offered when creating a new savings goal
     ("Mis metas"). The goal's name is free text typed by the person.
   - learnTeaser: placeholder cards for the "Aprender" tab (not yet
     built) — ids only; text and icon are en/es in strings.<locale>.js.
   ============================================================ */

var DATA = {
  categories: [
    { id: 'food', icon: '🍎' },
    { id: 'fun', icon: '🎮' },
    { id: 'transport', icon: '🚌' },
    { id: 'clothes', icon: '👕' },
    { id: 'health', icon: '❤️' },
    { id: 'other', icon: '🧩' }
  ],

  goalIcons: ['🎮', '⚽', '🚲', '📱', '🎧', '👟', '📚', '🎁'],

  learnTeaser: ['change', 'budget', 'needsWants']
};
