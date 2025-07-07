// src/tasks/tokenRefreshTask.ts
import cron from "node-cron";
import { responseToken } from "../services/mercadoLivreService";
import { setToken } from "../lib/tokenCache";

// // Executa a cada 50 minutos
// cron.schedule('*/50 * * * *', async () => {
//   console.log('[CRON] Verificando necessidade de refresh do token...');
//   await refreshAccessToken();
// });

// Executa a cada 1 minuto
// cron.schedule('* * * * *', async () => {
cron.schedule("*/20 * * * *", async () => {
  const ResponseToken = new responseToken();
  console.log("[CRON] Verificando necessidade de refresh do token...");
  await ResponseToken.execute().then((token) => {
    setToken(token);
  });
});
