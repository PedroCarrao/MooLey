const JogadorRepository = require('../repositories/JogadorRepository');

class JogadorService {
  constructor() {
    this.jogadorRepository = new JogadorRepository();
  }

  async listar() {
    return await this.jogadorRepository.listar();
  }

  async obterPorId(id) {
    const jogador = await this.jogadorRepository.obterPorId(id);
    if (!jogador) {
      throw new Error('Jogador não encontrado.');
    }
    return jogador;
  }

  async autenticarJogador(nome, altura) {
    const jogador = await this.jogadorRepository.findByNomeEAltura(nome, altura);
    if (!jogador) {
      throw new Error('Jogador não encontrado com este nome e altura.');
    }
    return jogador;
  }

  async criar(dados) {
    if (!dados.nome || !dados.altura) {
      throw new Error('Nome e altura são obrigatórios.');
    }
    return await this.jogadorRepository.criar(dados);
  }

  async deletar(id) {
    await this.obterPorId(id);
    await this.jogadorRepository.deletar(id);
  }
  async atualizar(id, dados) {
  await this.obterPorId(id); // Garante que o jogador existe
  return await this.jogadorRepository.atualizar(id, dados);
}
}

module.exports = JogadorService;