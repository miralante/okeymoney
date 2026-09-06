/* ============================================================
   Okeymoney — Locale-neutral data.
   NO logic or UI text here — names live in strings.es.js / strings.en.js
   under matching keys (categories.<id>, learn.teaser.<id>).

   - categories: expense categories shown as icon buttons in step 1 of
     "Registrar un gasto". Kept to 6 max (accessibility rule: 4-6 options
     per screen).
   - goalIcons: icon choices offered when creating a new savings goal
     ("Mis metas"). The goal's name is free text typed by the person.
   - blocks / learningPath / simulations: the home structure and its
     declarative content catalogues.
   - activities / learnThemes: test metadata and pedagogical themes — ids
     only; text and icon are en/es in strings.<locale>.js.
   ============================================================ */

var DATA = {
  /* The home has three clear parts: everyday situations, actions with the
     person's money, and practical ideas for caring for it. */
  blocks: [
    { id: 'didactic', accent: 'acento-3', anchor: 'bloque-didactico' },
    { id: 'simulation', accent: 'acento', anchor: 'bloque-simulacion' },
    { id: 'guide', accent: 'acento-2', anchor: 'bloque-cuidado' }
  ],

  /* Five short units keep the learning path visible at a glance. Activities
     and simulations point back to a unit with `unitId`, so adding content
     never requires editing the home markup. */
  learningPath: [
    { id: 'money', icon: '💶', steps: ['moneyStep1', 'moneyStep2', 'moneyStep3'], exampleKey: 'moneyExample' },
    { id: 'choices', icon: '🧠', steps: ['choicesStep1', 'choicesStep2', 'choicesStep3'], exampleKey: 'choicesExample' },
    { id: 'budget', icon: '📋', steps: ['budgetStep1', 'budgetStep2', 'budgetStep3'], exampleKey: 'budgetExample' },
    { id: 'change', icon: '🧾', steps: ['changeStep1', 'changeStep2', 'changeStep3'], exampleKey: 'changeExample' },
    { id: 'safety', icon: '🛡️', steps: ['safetyStep1', 'safetyStep2', 'safetyStep3'], exampleKey: 'safetyExample' }
  ],

  /* Home simulation cards. The catalogue owns presentation metadata; the
     `action` value is the stable hand-off to the existing wizard dispatcher.
     A new card therefore needs one data entry and, only for a new behaviour,
     one dispatcher implementation in app.js. */
  simulations: [
    { id: 'balance', unitId: 'money', icon: '💶', group: 'organise', accent: 'acento', titleKey: 'blocks.simulation.balanceTitle', detailKey: 'blocks.simulation.balanceDetail', action: 'balance', variant: 'money' },
    { id: 'income', unitId: 'money', icon: '🫴', group: 'organise', accent: 'acento', titleKey: 'income.title', detailKey: 'income.instruction', action: 'income' },
    { id: 'goals', unitId: 'money', icon: '🎯', group: 'organise', accent: 'acento-2', titleKey: 'blocks.simulation.goalsTitle', detailKey: 'goals.empty', action: 'goals', variant: 'goals' },
    { id: 'expense', unitId: 'choices', icon: '🧾', group: 'buy', accent: 'acento-2', titleKey: 'blocks.simulation.expenseTitle', detailKey: 'blocks.simulation.expenseDetail', action: 'expense' },
    { id: 'plan', unitId: 'choices', icon: '🛒', group: 'buy', accent: 'acento-2', titleKey: 'blocks.simulation.planTitle', detailKey: 'blocks.simulation.planDetail', action: 'plan' },
    { id: 'purchase', unitId: 'choices', icon: '📦', group: 'buy', accent: 'acento-2', titleKey: 'blocks.simulation.purchaseTitle', detailKey: 'blocks.simulation.purchaseDetail', action: 'purchase' },
    { id: 'commitment', unitId: 'budget', icon: '📌', group: 'check', accent: 'acento-3', titleKey: 'commitments.title', detailKey: 'commitments.detail', action: 'commitment' },
    { id: 'depreciation', unitId: 'budget', icon: '📉', group: 'check', accent: 'acento-3', advanced: true, titleKey: 'blocks.simulation.depreciationTitle', detailKey: 'blocks.simulation.depreciationDetail', action: 'depreciation' },
    { id: 'obsolescence', unitId: 'budget', icon: '♻️', group: 'check', accent: 'acento-3', advanced: true, titleKey: 'blocks.simulation.obsolescenceTitle', detailKey: 'blocks.simulation.obsolescenceDetail', action: 'obsolescence' },
    { id: 'return', unitId: 'change', icon: '📈', group: 'check', accent: 'acento-3', advanced: true, titleKey: 'blocks.simulation.returnTitle', detailKey: 'blocks.simulation.returnDetail', action: 'return' },
    { id: 'risk', unitId: 'change', icon: '⚖️', group: 'check', accent: 'acento-3', advanced: true, titleKey: 'blocks.simulation.riskTitle', detailKey: 'blocks.simulation.riskDetail', action: 'risk' },
    { id: 'investment', unitId: 'change', icon: '🔄', group: 'check', accent: 'acento-3', advanced: true, titleKey: 'blocks.simulation.investmentTitle', detailKey: 'blocks.simulation.investmentDetail', action: 'investment' },
    { id: 'bankProducts', unitId: 'change', icon: '💳', group: 'check', accent: 'acento-3', advanced: true, titleKey: 'blocks.simulation.bankProductsTitle', detailKey: 'blocks.simulation.bankProductsDetail', action: 'bankProducts' },
    { id: 'housing', unitId: 'change', icon: '🏠', group: 'check', accent: 'acento-3', advanced: true, titleKey: 'blocks.simulation.housingTitle', detailKey: 'blocks.simulation.housingDetail', action: 'housing' },
    { id: 'change', unitId: 'change', icon: '💸', group: 'check', accent: 'acento-3', titleKey: 'blocks.simulation.changeTitle', detailKey: 'blocks.simulation.changeDetail', action: 'change' },
    { id: 'safety', unitId: 'safety', icon: '🛡️', group: 'check', accent: 'acento-3', titleKey: 'blocks.simulation.safetyTitle', detailKey: 'blocks.simulation.safetyDetail', action: 'safety' },
    { id: 'rights', unitId: 'safety', icon: '📄', group: 'check', accent: 'acento-3', titleKey: 'blocks.simulation.rightsTitle', detailKey: 'blocks.simulation.rightsDetail', action: 'rights' },
    { id: 'communication', unitId: 'safety', icon: '💬', group: 'check', accent: 'acento-3', titleKey: 'blocks.simulation.communicationTitle', detailKey: 'blocks.simulation.communicationDetail', action: 'communication' },
    { id: 'emergency', unitId: 'safety', icon: '🚨', group: 'check', accent: 'acento-3', titleKey: 'blocks.simulation.emergencyTitle', detailKey: 'blocks.simulation.emergencyDetail', action: 'emergency' }
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

  /* Activities shown in the home catalogue (SPEC.md §7.4) and
     the "Aprender" tab (same renderer), grouped by `theme` and, within a
     theme, ordered from most educational to most practical. Each entry:
     { slug, unitId, href, icon, theme }. `available: false` activities render
     locked with a "coming soon" badge so the user sees the full roadmap
     without bumping into broken links.

     Themes (see learnThemes below), fixed pedagogical order:
     - 'concepts': what money is, need vs want — the educational core.
     - 'daily':    budget, shopping, change, a full shopping day —
       simulation and practice, once the concepts are in place.
     - 'safety':   recognising scams and fraud — the highest-stakes
       practical skill, kept last on purpose. */
  activities: [
{ slug: 'concepts-money',  unitId: 'money', href: 'tools/concepts-money/index.html',  icon: '💰', available: true, theme: 'concepts' },
    { slug: 'needs-vs-wants',  unitId: 'choices', href: 'tools/needs-vs-wants/index.html',  icon: '🤔', available: true, theme: 'concepts' },
    { slug: 'budget-first',    unitId: 'budget', href: 'tools/budget-first/index.html',    icon: '📋', available: true, theme: 'daily' },
    { slug: 'before-buying',   unitId: 'choices', href: 'tools/before-buying/index.html',   icon: '🛒', available: true, theme: 'daily' },
    { slug: 'go-shopping',     unitId: 'budget', href: 'tools/go-shopping/index.html',     icon: '🛒', available: true, theme: 'daily' },
    { slug: 'change-back',     unitId: 'change', href: 'tools/change-back/index.html',     icon: '💸', available: true, theme: 'daily' },
    { slug: 'my-shopping-day', unitId: 'change', href: 'tools/my-shopping-day/index.html', icon: '🌟', available: true, theme: 'daily' },
    { slug: 'save-step-by-step', unitId: 'money', href: 'tools/save-step-by-step/index.html', icon: '🎯', available: true, theme: 'daily' },
    { slug: 'compare-prices', unitId: 'choices', href: 'tools/compare-prices/index.html', icon: '🏷️', available: true, theme: 'daily' },
    { slug: 'monthly-payments', unitId: 'budget', href: 'tools/monthly-payments/index.html', icon: '📅', available: true, theme: 'daily' },
    { slug: 'safe-money',      unitId: 'safety', href: 'tools/safe-money/index.html',      icon: '🛡️', available: true, theme: 'safety' }
  ],

  /* Section headers painted above each theme's activity cards, in fixed
     pedagogical display order (SPEC.md §7.4). `accent` names
     the tokens.css pair (--<accent> / --<accent>-suave) the section sets
     locally so its heading and cards re-color without extra CSS. */
  learnThemes: [
    { id: 'concepts', accent: 'acento'   },
    { id: 'daily',    accent: 'acento-2' },
    { id: 'safety',   accent: 'acento-3' }
  ]
};
