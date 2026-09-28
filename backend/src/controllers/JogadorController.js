const JogadorService = require('../services/JogadorService');

class JogadorController {
  constructor() {
    this.jogadorService = new JogadorService();
  }

  listar = async (req, res) => {
    try {
      const jogadores = await this.jogadorService.listarTodos();
      return res.status(200).json(jogadores);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  obterPorId = async (req, res) => {
    try {
      const id = Number(req.params.id);
      const jogador = await this.jogadorService.buscarPorId(id);
      return res.status(200).json(jogador);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  };

  criar = async (req, res) => {
    try {
      const novoJogador = await this.jogadorService.criarJogador(req.body);
      return res.status(201).json(novoJogador);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  deletar = async (req, res) => {
    try {
      const id = Number(req.params.id);
      await this.jogadorService.deletarJogador(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };
}

module.exports = JogadorController;