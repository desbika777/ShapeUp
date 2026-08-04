// Ponto de entrada da API em ambiente local/producao.
import { env } from './config/env.js';
import { createApp } from './app.js';

const app = createApp();

// Inicia o servidor usando a porta validada em config/env.ts.
app.listen(env.PORT, () => {
  console.log(`ShapeUp API running on port ${env.PORT}`);
});
