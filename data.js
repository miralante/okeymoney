/* ============================================================
   Okeymoney — Locale-neutral data.
   NO logic or UI text here — names live in strings.es.js / strings.en.js
   under matching keys (categories.<id>, learn.teaser.<id>).

   - categories: expense categories shown as icon buttons in step 1 of
     "Registrar un gasto". Kept to 6 max (accessibility rule: 4-6 options
     per screen).
   - goalIcons: icon choices offered when creating a new savings goal
     ("Mis metas"). The goal's name is free text typed by the person.
   - activities / learnThemes: catalogue and theme sections for the
     "Aprender" tab — ids only; text and icon are en/es in
     strings.<locale>.js.
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

  /* Activities shown in the home catalogue (PRODUCT-DESIGN.md §4.1) and
     the "Aprender" tab (same renderer), grouped by `theme` and, within a
     theme, ordered from most educational to most practical. Each entry:
     { slug, href, icon, theme }. `available: false` activities render
     locked with a "coming soon" badge so the user sees the full roadmap
     without bumping into broken links.

     Themes (see learnThemes below), fixed pedagogical order:
     - 'concepts': what money is, need vs want — the educational core.
     - 'daily':    budget, shopping, change, a full shopping day —
       simulation and practice, once the concepts are in place.
     - 'safety':   recognising scams and fraud — the highest-stakes
       practical skill, kept last on purpose. */
  activities: [
    { slug: 'concepts-money',  href: 'tools/concepts-money/index.html',  icon: '💰', available: true, theme: 'concepts' },
    { slug: 'needs-vs-wants',  href: 'tools/needs-vs-wants/index.html',  icon: '🤔', available: true, theme: 'concepts' },
    { slug: 'budget-first',    href: 'tools/budget-first/index.html',    icon: '📋', available: true, theme: 'daily' },
    { slug: 'go-shopping',     href: 'tools/go-shopping/index.html',     icon: '🛒', available: true, theme: 'daily' },
    { slug: 'change-back',     href: 'tools/change-back/index.html',     icon: '💸', available: true, theme: 'daily' },
    { slug: 'my-shopping-day', href: 'tools/my-shopping-day/index.html', icon: '🌟', available: true, theme: 'daily' },
    { slug: 'safe-money',      href: 'tools/safe-money/index.html',      icon: '🛡️', available: true, theme: 'safety' }
  ],

  /* Section headers painted above each theme's activity cards, in fixed
     pedagogical display order (PRODUCT-DESIGN.md §4.2). `accent` names
     the tokens.css pair (--<accent> / --<accent>-suave) the section sets
     locally so its heading and cards re-color without extra CSS. */
  learnThemes: [
    { id: 'concepts', accent: 'acento'   },
    { id: 'daily',    accent: 'acento-2' },
    { id: 'safety',   accent: 'acento-3' }
  ]
};
