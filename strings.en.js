/* Okeymoney — English texts (parity with strings.es.js, checked by scripts/check.js). */
(function () {
  'use strict';
  App.i18n.register({
    title: 'Okeymoney',

    tabs: {
      home: 'My money',
      goals: 'My goals',
      learn: 'Learn',
      newExpenseAria: 'Add an expense'
    },

    home: {
      balanceLabel: 'You have',
      editBalanceAria: 'Change how much money you have',
      editHint: 'Tap the number to change it',
      recentTitle: 'Your latest movements',
      recentEmpty: "You haven't added any expenses yet.",
      setBalanceTitle: 'How much money do you have?',
      setBalanceInstruction: 'Count your money and write how much you have now.'
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
      teaser: {
        change: '🪙 Working out change',
        budget: '📋 Making a budget',
        needsWants: '🤔 What I need and what I want'
      }
    },

    wizard: {
      closeAria: 'Close without saving'
    }
  }, 'en');
})();
