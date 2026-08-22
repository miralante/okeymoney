/* Okeymoney — English texts (parity with strings.es.js, checked by scripts/check.js). */
(function () {
  'use strict';
  App.i18n.register({
    title: 'Okeymoney',
    appName: 'Okeymoney',

    agent: {
      persona: 'Person',
      empresa: 'Shop',
      banco: 'Bank'
    },

    meta: {
      description: 'Learn to manage your money: how much you have, how much you spend, and how much you save.'
    },

    tabs: {
      home: 'My money',
      goals: 'My goals',
      learn: 'Learn',
      newExpenseAria: 'Add an expense'
    },

    home: {
      saludo: 'Hi. What do you want to do today?',
      moreGoals: '+{n} more',
      anchorAria: 'Jump to {theme}',
      balanceLabel: 'You have',
      editBalanceAria: 'Change how much money you have',
      editHint: 'Tap to change how much money you have',
      setBalanceTitle: 'How much money do you have?',
      setBalanceInstruction: 'Count your money and write how much you have now.',
      catalogueTitle: 'Learn with Okeymoney'
    },

    expense: {
      categoryTitle: 'What did you spend on?',
      categoryInstruction: 'Choose a picture.',
      amountTitle: 'How much did you spend?',
      amountInstruction: 'Write the price.',
      confirmTitle: 'Check your expense',
      confirmInstruction: 'If it looks right, save it.',
      saveButton: '✅ Save expense',
      savedMessage: 'Expense saved!'
    },

    categories: {
      food: 'Food',
      fun: 'Fun',
      transport: 'Transport',
      clothes: 'Clothes',
      health: 'Health',
      other: 'Other'
    },

    goals: {
      title: 'My goals',
      newButton: '+ New goal',
      empty: "You don't have any goals yet. Create the first one!",
      newTitle: 'What do you want to get?',
      newInstruction: 'Choose a picture and write its name.',
      namePlaceholder: 'For example: a game',
      nameAria: 'Your goal name',
      targetTitle: 'How much does it cost?',
      targetInstruction: 'Write the price.',
      addTitle: 'How much do you want to save?',
      addInstruction: 'Write the amount.',
      addButton: '+ Add money',
      progressText: '{saved} of {target}',
      achievedBadge: '🏆 Goal reached!',
      savedMessage: 'Goal created!',
      addedMessage: 'Money saved!'
    },

    learn: {
      title: 'Learn',
      comingSoon: "Soon you'll be able to practise here with games about money.",
      walletLabel: 'Your practice wallet',
      intro: 'Earn 🪙 by practising activities. Your practice wallet is separate from your real money.',
      stateDone: '✓ Done',
      stateAvailable: '▶ Start',
      stateLocked: '🔒 Soon',
      themes: {
        concepts: 'Basic concepts',
        daily: 'Everyday life',
        safety: 'Safety'
      },
      activityTitle: {
        'concepts-money':  'What is money?',
        'needs-vs-wants':  'Need or want',
        'budget-first':    'What do I buy first?',
        'go-shopping':     'Go shopping',
        'change-back':     'Working out change',
        'my-shopping-day': 'My shopping day',
        'safe-money':      'My money is safe'
      },
      activityDesc: {
        'concepts-money':  'Identify coins and banknotes by their value.',
        'needs-vs-wants':  'Tell apart what you need from what you want.',
        'budget-first':    'Decide what to buy first with a limited budget.',
        'go-shopping':     'Make a small purchase with a budget.',
        'change-back':     'Calculate how much change you should get.',
        'my-shopping-day': 'Practise everything together in a full shop.',
        'safe-money':      'Recognise strange transfers and scams, and what to do.'
      }
    },

    wizard: {
      closeAria: 'Close without saving'
    },

    keypad: {
      deleteDigit: 'Delete last digit',
      clear: 'Clear'
    },

    offline: {
      title: 'Offline',
      heading: 'Offline',
      body: "We couldn't load this page. Check your internet connection and try again.",
      homeLink: 'Back to Okeymoney',
      metaDescription: "Okeymoney is offline: check your internet connection and try again."
    }
  }, 'en');
})();
