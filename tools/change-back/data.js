/* tools/change-back/data.js
   Each case: shop (empresa), paidCents, costCents. User types the
   change owed (paid - cost). Locale-neutral. */
var DATA = {
  casos: [
    { id: 'c1', agente: 'empresa', agenteName: 'shopMercadona', paidCents: 500,  costCents: 130 },
    { id: 'c2', agente: 'empresa', agenteName: 'shopPanaderia', paidCents: 500,  costCents: 220 },
    { id: 'c3', agente: 'empresa', agenteName: 'shopFarmacia',  paidCents: 1000, costCents: 450 },
    { id: 'c4', agente: 'empresa', agenteName: 'shopMercadona', paidCents: 1000, costCents: 770 },
    { id: 'c5', agente: 'empresa', agenteName: 'shopTienda',    paidCents: 2000, costCents: 1450 },
    { id: 'c6', agente: 'empresa', agenteName: 'shopMercadona', paidCents: 5000, costCents: 2350 }
  ],
  rewardCents: 3000
};
