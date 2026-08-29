/* ============================================================
   Okeymoney — Locale-neutral data.
   NO logic or UI text here — names live in strings.es.js / strings.en.js
   under matching keys (categories.<id>, learn.teaser.<id>).

   - categories: expense categories shown as icon buttons in step 1 of
     "Registrar un gasto". Kept to 6 max (accessibility rule: 4-6 options
     per screen).
   - goalIcons: icon choices offered when creating a new savings goal
     ("Mis metas"). The goal's name is free text typed by the person.
   - blocks / didacticLessons: the two learning parts shown on the home
     (didactic content with tests, and a guide to act with euro practice).
   - activities / learnThemes: test metadata and pedagogical themes — ids
     only; text and icon are en/es in strings.<locale>.js.
   ============================================================ */

var DATA = {
  /* The home has two clear parts: didactic content (with its test) and a
     practical guide for acting with real-euro decisions. */
  blocks: [
    { id: 'didactic', accent: 'acento-3' },
    { id: 'guide', accent: 'acento' }
  ],

  didacticLessons: [
    { id: 'money', icon: '💶' },
    { id: 'choices', icon: '🧠' },
    { id: 'budget', icon: '📋' },
    { id: 'beforeBuying', icon: '🛒' },
    { id: 'change', icon: '🧾' },
    { id: 'saving', icon: '🪙' },
    { id: 'safety', icon: '🛡️' },
    { id: 'documents', icon: '📦' },
    { id: 'assets', icon: '📊' },
    { id: 'accounting', icon: '📚' },
    { id: 'assetLifecycle', icon: '📉' },
    { id: 'returnRisk', icon: '⚖️' },
    { id: 'investmentOperations', icon: '🔄' },
    { id: 'bankProducts', icon: '💳' },
    { id: 'housing', icon: '🏠' }
  ],

  /* Source-of-truth index for the explain → check → apply sequence.
     Keep testSlugs in the same pedagogical order as DATA.activities. */
  learningIndex: [
    { id: 'money', testSlugs: ['concepts-money', 'my-shopping-day'], simulationCards: ['balance'] },
    { id: 'choices', testSlugs: ['needs-vs-wants', 'my-shopping-day'], simulationCards: ['plan', 'expense'] },
    { id: 'budget', testSlugs: ['budget-first', 'go-shopping', 'my-shopping-day'], simulationCards: ['plan', 'expense'] },
    { id: 'beforeBuying', testSlugs: ['before-buying'], simulationCards: ['plan', 'expense'] },
    { id: 'change', testSlugs: ['change-back', 'my-shopping-day'], simulationCards: ['change'] },
    { id: 'saving', testSlugs: ['my-shopping-day'], simulationCards: ['goals'] },
    { id: 'safety', testSlugs: ['safe-money'], simulationCards: ['safety', 'rights', 'communication', 'emergency'] },
    { id: 'documents', testSlugs: ['go-shopping'], simulationCards: ['purchaseLifecycle'] },
    { id: 'assets', testSlugs: ['concepts-money', 'budget-first'], simulationCards: ['snapshot'] },
    { id: 'accounting', testSlugs: ['concepts-money', 'budget-first'], simulationCards: ['control'] },
    { id: 'assetLifecycle', testSlugs: ['concepts-money', 'budget-first'], simulationCards: ['depreciation', 'obsolescence'] },
    { id: 'returnRisk', testSlugs: ['concepts-money', 'budget-first'], simulationCards: ['return', 'risk'] },
    { id: 'investmentOperations', testSlugs: ['concepts-money', 'budget-first'], simulationCards: ['investment'] },
    { id: 'bankProducts', testSlugs: ['concepts-money', 'budget-first'], simulationCards: ['bankProducts'] },
    { id: 'housing', testSlugs: ['concepts-money', 'budget-first'], simulationCards: ['housing'] }
  ],

  /* Euro simulations apply the concepts without Tokens or hidden writes to
     the ledger. A person can rehearse first, then choose to record a real
     expense from the simulation block. */
  changeScenarios: [
    { id: 'bakery', paidCents: 500, costCents: 230 },
    { id: 'pharmacy', paidCents: 1000, costCents: 650 },
    { id: 'market', paidCents: 2000, costCents: 1270 }
  ],

  safetyScenarios: [
    { id: 'bizum', options: ['blocks.simulation.safetyScenarios.bizumUnsafe', 'blocks.simulation.safetyScenarios.bizumSafe'], safeIndex: 1 },
    { id: 'sms', options: ['blocks.simulation.safetyScenarios.smsUnsafe', 'blocks.simulation.safetyScenarios.smsSafe'], safeIndex: 1 },
    { id: 'family', options: ['blocks.simulation.safetyScenarios.familyUnsafe', 'blocks.simulation.safetyScenarios.familySafe'], safeIndex: 1 }
  ],

  /* Everyday autonomy simulations. They rehearse a response without
     touching the real balance: rights, clear communication and emergencies. */
  autonomyScenarios: {
    rights: [
      { id: 'return', options: ['blocks.simulation.rightsScenarios.returnUnsafe', 'blocks.simulation.rightsScenarios.returnSafe'], safeIndex: 1 },
      { id: 'receipt', options: ['blocks.simulation.rightsScenarios.receiptUnsafe', 'blocks.simulation.rightsScenarios.receiptSafe'], safeIndex: 1 },
      { id: 'charge', options: ['blocks.simulation.rightsScenarios.chargeUnsafe', 'blocks.simulation.rightsScenarios.chargeSafe'], safeIndex: 1 }
    ],
    communication: [
      { id: 'price', options: ['blocks.simulation.communicationScenarios.priceUnsafe', 'blocks.simulation.communicationScenarios.priceSafe'], safeIndex: 1 },
      { id: 'no', options: ['blocks.simulation.communicationScenarios.noUnsafe', 'blocks.simulation.communicationScenarios.noSafe'], safeIndex: 1 },
      { id: 'help', options: ['blocks.simulation.communicationScenarios.helpUnsafe', 'blocks.simulation.communicationScenarios.helpSafe'], safeIndex: 1 }
    ],
    emergency: [
      { id: 'card', options: ['blocks.simulation.emergencyScenarios.cardUnsafe', 'blocks.simulation.emergencyScenarios.cardSafe'], safeIndex: 1 },
      { id: 'repair', options: ['blocks.simulation.emergencyScenarios.repairUnsafe', 'blocks.simulation.emergencyScenarios.repairSafe'], safeIndex: 1 },
      { id: 'urgent', options: ['blocks.simulation.emergencyScenarios.urgentUnsafe', 'blocks.simulation.emergencyScenarios.urgentSafe'], safeIndex: 1 }
    ]
  },

  /* Asset-life simulations. Straight-line depreciation is used as a simple,
     transparent estimate: cost minus residual value, spread over useful life.
     These are practice-only and never write to the real ledger. */
  depreciationScenarios: [
    { id: 'phone', priceCents: 60000, lifeMonths: 24, elapsedMonths: 12, residualCents: 0 },
    { id: 'laptop', priceCents: 100000, lifeMonths: 36, elapsedMonths: 18, residualCents: 10000 },
    { id: 'bike', priceCents: 48000, lifeMonths: 48, elapsedMonths: 24, residualCents: 8000 }
  ],

  /* Obsolescence is a decision skill: compare support, repair, reuse and
     replacement costs before spending. The safe choice is intentionally
     practical rather than forcing a purchase. */
  obsolescenceScenarios: [
    { id: 'phone', options: ['blocks.simulation.obsolescenceScenarios.phoneUnsafe', 'blocks.simulation.obsolescenceScenarios.phoneSafe'], safeIndex: 1 },
    { id: 'laptop', options: ['blocks.simulation.obsolescenceScenarios.laptopUnsafe', 'blocks.simulation.obsolescenceScenarios.laptopSafe'], safeIndex: 1 },
    { id: 'appliance', options: ['blocks.simulation.obsolescenceScenarios.applianceUnsafe', 'blocks.simulation.obsolescenceScenarios.applianceSafe'], safeIndex: 1 }
  ],

  /* Return simulations use hypothetical gross annual rates only to make the
     arithmetic visible. They are educational examples, not promises. */
  returnScenarios: [
    { id: 'savings', principalCents: 10000, rateBps: 300 },
    { id: 'bond', principalCents: 25000, rateBps: 400 },
    { id: 'diversified', principalCents: 50000, rateBps: 600 }
  ],

  /* Risk is contextual: time horizon, liquidity and diversification matter.
     Choices rehearse a check before committing real money. */
  riskScenarios: [
    { id: 'emergency', options: ['blocks.simulation.riskScenarios.emergencyUnsafe', 'blocks.simulation.riskScenarios.emergencySafe'], safeIndex: 1 },
    { id: 'diversify', options: ['blocks.simulation.riskScenarios.diversifyUnsafe', 'blocks.simulation.riskScenarios.diversifySafe'], safeIndex: 1 },
    { id: 'horizon', options: ['blocks.simulation.riskScenarios.horizonUnsafe', 'blocks.simulation.riskScenarios.horizonSafe'], safeIndex: 1 }
  ],

  /* Investment operations are rehearsed as recognisable actions, not as
     brokerage commands: buy/contribute, sell/redeem, collect a return and
     transfer between products. The safe choice is the operation's name. */
  investmentScenarios: [
    { id: 'buy', options: ['blocks.simulation.investmentScenarios.buyWrong', 'blocks.simulation.investmentScenarios.buyCorrect'], safeIndex: 1 },
    { id: 'sell', options: ['blocks.simulation.investmentScenarios.sellWrong', 'blocks.simulation.investmentScenarios.sellCorrect'], safeIndex: 1 },
    { id: 'return', options: ['blocks.simulation.investmentScenarios.returnWrong', 'blocks.simulation.investmentScenarios.returnCorrect'], safeIndex: 1 },
    { id: 'transfer', options: ['blocks.simulation.investmentScenarios.transferWrong', 'blocks.simulation.investmentScenarios.transferCorrect'], safeIndex: 1 }
  ],

  /* Card and account types are explained by where the money comes from,
     where it sits and when it is charged. These are recognition exercises,
     never applications for a bank product. */
  bankProductsScenarios: [
    { id: 'debit', options: ['blocks.simulation.bankProductsScenarios.debitWrong', 'blocks.simulation.bankProductsScenarios.debitCorrect'], safeIndex: 1 },
    { id: 'credit', options: ['blocks.simulation.bankProductsScenarios.creditWrong', 'blocks.simulation.bankProductsScenarios.creditCorrect'], safeIndex: 1 },
    { id: 'prepaid', options: ['blocks.simulation.bankProductsScenarios.prepaidWrong', 'blocks.simulation.bankProductsScenarios.prepaidCorrect'], safeIndex: 1 },
    { id: 'current', options: ['blocks.simulation.bankProductsScenarios.currentWrong', 'blocks.simulation.bankProductsScenarios.currentCorrect'], safeIndex: 1 },
    { id: 'savings', options: ['blocks.simulation.bankProductsScenarios.savingsWrong', 'blocks.simulation.bankProductsScenarios.savingsCorrect'], safeIndex: 1 }
  ],

  /* Housing choices are a comparison exercise, not a universal prescription:
     review recurring costs, upfront money, maintenance and time horizon. */
  housingScenarios: [
    { id: 'rent', options: ['blocks.simulation.housingScenarios.rentWrong', 'blocks.simulation.housingScenarios.rentCorrect'], safeIndex: 1 },
    { id: 'own', options: ['blocks.simulation.housingScenarios.ownWrong', 'blocks.simulation.housingScenarios.ownCorrect'], safeIndex: 1 },
    { id: 'costs', options: ['blocks.simulation.housingScenarios.costsWrong', 'blocks.simulation.housingScenarios.costsCorrect'], safeIndex: 1 },
    { id: 'flexibility', options: ['blocks.simulation.housingScenarios.flexibilityWrong', 'blocks.simulation.housingScenarios.flexibilityCorrect'], safeIndex: 1 },
    { id: 'longTerm', options: ['blocks.simulation.housingScenarios.longTermWrong', 'blocks.simulation.housingScenarios.longTermCorrect'], safeIndex: 1 }
  ],

  /* A purchase has four useful checkpoints. Only the final payment writes
     an expense; the previous documents stay a reversible rehearsal. */
  purchaseLifecycleScenarios: [
    { id: 'backpack', priceCents: 2400, categoryId: 'other' },
    { id: 'shoes', priceCents: 3600, categoryId: 'clothes' },
    { id: 'repair', priceCents: 9000, categoryId: 'health' }
  ],

  planItems: [
    { id: 'bread', icon: '🍞', categoryId: 'food', priceCents: 200 },
    { id: 'bus', icon: '🚌', categoryId: 'transport', priceCents: 150 },
    { id: 'medicine', icon: '💊', categoryId: 'health', priceCents: 650 },
    { id: 'game', icon: '🎮', categoryId: 'fun', priceCents: 1200 }
  ],

  incomeSources: [
    { id: 'allowance', icon: '🫴' },
    { id: 'work', icon: '💼' },
    { id: 'gift', icon: '🎁' },
    { id: 'refund', icon: '↩️' }
  ],

  categories: [
    { id: 'food', icon: '🍎', classification: 'essential' },
    { id: 'fun', icon: '🎮', classification: 'discretionary' },
    { id: 'transport', icon: '🚌', classification: 'essential' },
    { id: 'clothes', icon: '👕', classification: 'discretionary' },
    { id: 'health', icon: '❤️', classification: 'essential' },
    { id: 'other', icon: '🧩', classification: 'discretionary' }
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
    { slug: 'before-buying',   href: 'tools/before-buying/index.html',   icon: '🛒', available: true, theme: 'daily' },
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
