(function () {
  'use strict';
  App.activity.run({
  "slug": "compare-prices",
  "rewardCents": 1200,
  "shuffleCases": false,
  "transferKey": "transfer",
  "casos": [
    {
      "id": "case1",
      "level": 1,
      "sceneKey": "cases.c0.scene",
      "agente": "persona",
      "agenteName": "actor",
      "opciones": [
        "cases.c0.o0",
        "cases.c0.o1",
        "cases.c0.o2"
      ],
      "correctaIndex": 1,
      "pistaKey": "cases.c0.hint",
      "explicacionKey": "cases.c0.explanation"
    },
    {
      "id": "case2",
      "level": 1,
      "sceneKey": "cases.c1.scene",
      "agente": "persona",
      "agenteName": "actor",
      "opciones": [
        "cases.c1.o0",
        "cases.c1.o1",
        "cases.c1.o2"
      ],
      "correctaIndex": 0,
      "pistaKey": "cases.c1.hint",
      "explicacionKey": "cases.c1.explanation"
    },
    {
      "id": "case3",
      "level": 2,
      "sceneKey": "cases.c2.scene",
      "agente": "persona",
      "agenteName": "actor",
      "opciones": [
        "cases.c2.o0",
        "cases.c2.o1",
        "cases.c2.o2"
      ],
      "correctaIndex": 2,
      "pistaKey": "cases.c2.hint",
      "explicacionKey": "cases.c2.explanation"
    },
    {
      "id": "case4",
      "level": 2,
      "sceneKey": "cases.c3.scene",
      "agente": "persona",
      "agenteName": "actor",
      "opciones": [
        "cases.c3.o0",
        "cases.c3.o1",
        "cases.c3.o2"
      ],
      "correctaIndex": 0,
      "pistaKey": "cases.c3.hint",
      "explicacionKey": "cases.c3.explanation"
    },
    {
      "id": "case5",
      "level": 3,
      "sceneKey": "cases.c4.scene",
      "agente": "persona",
      "agenteName": "actor",
      "opciones": [
        "cases.c4.o0",
        "cases.c4.o1",
        "cases.c4.o2"
      ],
      "correctaIndex": 1,
      "pistaKey": "cases.c4.hint",
      "explicacionKey": "cases.c4.explanation"
    },
    {
      "id": "case6",
      "level": 3,
      "sceneKey": "cases.c5.scene",
      "agente": "persona",
      "agenteName": "actor",
      "opciones": [
        "cases.c5.o0",
        "cases.c5.o1",
        "cases.c5.o2"
      ],
      "correctaIndex": 2,
      "pistaKey": "cases.c5.hint",
      "explicacionKey": "cases.c5.explanation"
    }
  ]
});
})();
