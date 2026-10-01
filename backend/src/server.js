const express = require('express');
const jogadorRoutes = require('./routes/jogadorRoutes');
const cors = require('cors');
const sequenciaTreinoRoutes = require('./routes/sequenciaTreinoRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Rotas da aplicação
app.use(jogadorRoutes);
app.use(sequenciaTreinoRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor a rodar na porta ${PORT}`);
});