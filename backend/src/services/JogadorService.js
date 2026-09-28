const JogadorRepository = require('../repositories/JogadorRepository');

class JogadorService {
  constructor() {
    this.jogadorRepository = new JogadorRepository();
  }

  async listarTodos() {
    return await this.jogadorRepository.findAll();
  }

  async buscarPorId(id) {
    const jogador = await this.jogadorRepository.findById(id);
    if (!jogador) {
      throw new Error('Jogador não encontrado.');
    }
    return jogador;
  }

  async criarJogador(dados) {
    if (!dados.nome || !dados.idade || dados.idade <= 0) {
      throw new Error('Dados do jogador inválidos.');
    }
    return await this.jogadorRepository.create(dados);
  }

  async deletarJogador(id) {
    const deletado = await this.jogadorRepository.delete(id);
    if (!deletado) {
      throw new Error('Jogador não encontrado para remoção.');
    }
  }
}

module.exports = JogadorService;