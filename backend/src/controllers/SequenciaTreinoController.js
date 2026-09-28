const SequenciaTreinoService = require('../services/SequenciaTreinoService');

class SequenciaTreinoController {
  constructor() {
    this.sequenciaTreinoService = new SequenciaTreinoService();
  }

  listar = async (req, res) => {
    try {
      const treinos = await this.sequenciaTreinoService.listarTodos();
      return res.status(200).json(treinos);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  obterPorId = async (req, res) => {
    try {
      const id = Number(req.params.id);
      const treino = await this.sequenciaTreinoService.buscarPorId(id);
      return res.status(200).json(treino);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  };

  criar = async (req, res) => {
    try {
      const novoTreino = await this.sequenciaTreinoService.criarSequencia(req.body);
      return res.status(201).json(novoTreino);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  deletar = async (req, res) => {
    try {
      const id = Number(req.params.id);
      await this.sequenciaTreinoService.deletarSequencia(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };
}

module.exports = SequenciaTreinoController;