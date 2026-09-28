const SequenciaTreinoRepository = require('../repositories/SequenciaTreinoRepository');

class SequenciaTreinoService {
  constructor() {
    this.sequenciaTreinoRepository = new SequenciaTreinoRepository();
  }

  async listarTodos() {
    return await this.sequenciaTreinoRepository.findAll();
  }

  async buscarPorId(id) {
    const treino = await this.sequenciaTreinoRepository.findById(id);
    if (!treino) {
      throw new Error('Sequência de treino não encontrada.');
    }
    return treino;
  }

  async criarSequencia(dados) {
    if (!dados.dia || !dados.tipo || !dados.treino) {
      throw new Error('Dia, tipo e treino são obrigatórios.');
    }
    return await this.sequenciaTreinoRepository.create(dados);
  }

  async deletarSequencia(id) {
    const deletado = await this.sequenciaTreinoRepository.delete(id);
    if (!deletado) {
      throw new Error('Sequência de treino não encontrada para remoção.');
    }
  }
}

module.exports = SequenciaTreinoService;