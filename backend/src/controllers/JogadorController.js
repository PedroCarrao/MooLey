const JogadorService = require('../services/JogadorService');
const jogadorService = new JogadorService();

class JogadorController {
  async listar(req, res) {
    try {
      const jogadores = await jogadorService.listar();
      res.json(jogadores);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async obterPorId(req, res) {
    try {
      const { id } = req.params;
      const jogador = await jogadorService.obterPorId(id);
      res.json(jogador);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { nome, altura } = req.body;
      const jogador = await jogadorService.autenticarJogador(nome, altura);
      res.json(jogador);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async criar(req, res) {
    try {
      const novoJogador = await jogadorService.criar(req.body);
      res.status(201).json(novoJogador);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      await jogadorService.deletar(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async atualizar(req, res) {
  try {
    const { id } = req.params;
    const jogadorAtualizado = await jogadorService.atualizar(id, req.body);
    res.json(jogadorAtualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
}

module.exports = JogadorController;