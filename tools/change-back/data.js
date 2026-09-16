/* tools/change-back/data.js
   Each case: shop (empresa), paidCents, costCents. User types the
   change owed (paid - cost). Locale-neutral. */
var DATA = {
  cases: [
    { id: 'c1', agent: 'empresa', agentName: 'shopMercadona', paidCents: 500,  costCents: 130 },
    { id: 'c2', agent: 'empresa', agentName: 'shopPanaderia', paidCents: 500,  costCents: 220 },
    { id: 'c3', agent: 'empresa', agentName: 'shopFarmacia',  paidCents: 1000, costCents: 450 },
    { id: 'c4', agent: 'empresa', agentName: 'shopMercadona', paidCents: 1000, costCents: 770 },
    { id: 'c5', agent: 'empresa', agentName: 'shopTienda',    paidCents: 2000, costCents: 1450 },
    { id: 'c6', agent: 'empresa', agentName: 'shopMercadona', paidCents: 5000, costCents: 2350 }
  ],
  rewardCents: 3000
};
