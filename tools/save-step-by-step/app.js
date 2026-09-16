(function () {
  'use strict';
  App.activity.run({
  "slug": "save-step-by-step",
  "rewardCents": 1200,
  "shuffleCases": false,
  "transferKey": "transfer",
  "cases": [
    {
      "id": "case1",
      "level": 1,
      "sceneKey": "cases.c0.scene",
      "agent": "persona",
      "agentName": "actor",
      "options": [
        "cases.c0.o0",
        "cases.c0.o1",
        "cases.c0.o2"
      ],
      "correctIndex": 0,
      "hintKey": "cases.c0.hint",
      "explanationKey": "cases.c0.explanation"
    },
    {
      "id": "case2",
      "level": 1,
      "sceneKey": "cases.c1.scene",
      "agent": "persona",
      "agentName": "actor",
      "options": [
        "cases.c1.o0",
        "cases.c1.o1",
        "cases.c1.o2"
      ],
      "correctIndex": 2,
      "hintKey": "cases.c1.hint",
      "explanationKey": "cases.c1.explanation"
    },
    {
      "id": "case3",
      "level": 2,
      "sceneKey": "cases.c2.scene",
      "agent": "persona",
      "agentName": "actor",
      "options": [
        "cases.c2.o0",
        "cases.c2.o1",
        "cases.c2.o2"
      ],
      "correctIndex": 1,
      "hintKey": "cases.c2.hint",
      "explanationKey": "cases.c2.explanation"
    },
    {
      "id": "case4",
      "level": 2,
      "sceneKey": "cases.c3.scene",
      "agent": "persona",
      "agentName": "actor",
      "options": [
        "cases.c3.o0",
        "cases.c3.o1",
        "cases.c3.o2"
      ],
      "correctIndex": 1,
      "hintKey": "cases.c3.hint",
      "explanationKey": "cases.c3.explanation"
    },
    {
      "id": "case5",
      "level": 3,
      "sceneKey": "cases.c4.scene",
      "agent": "persona",
      "agentName": "actor",
      "options": [
        "cases.c4.o0",
        "cases.c4.o1",
        "cases.c4.o2"
      ],
      "correctIndex": 0,
      "hintKey": "cases.c4.hint",
      "explanationKey": "cases.c4.explanation"
    },
    {
      "id": "case6",
      "level": 3,
      "sceneKey": "cases.c5.scene",
      "agent": "persona",
      "agentName": "actor",
      "options": [
        "cases.c5.o0",
        "cases.c5.o1",
        "cases.c5.o2"
      ],
      "correctIndex": 2,
      "hintKey": "cases.c5.hint",
      "explanationKey": "cases.c5.explanation"
    }
  ]
});
})();
