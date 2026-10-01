const { pool } = require('../config/db');

class JogadorRepository {
  async findAll() {
    const query = 'SELECT * FROM public.jogador ORDER BY id ASC;';
    const { rows } = await pool.query(query);
    return rows;
  }

  // Alias para o Service
  async listar() {
    return await this.findAll();
  }

  async findById(id) {
    const query = 'SELECT * FROM public.jogador WHERE id = $1;';
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }

  // Alias para resolver o erro 'obterPorId is not a function'
  async obterPorId(id) {
    return await this.findById(id);
  }

  async create(dados) {
    const query = `
      INSERT INTO public.jogador (nome, altura, posicao, idade, envergadura, al_ver)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      dados.nome,
      dados.altura,
      dados.posicao,
      dados.idade,
      dados.envergadura,
      dados.al_ver,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  // Alias para o Service
  async criar(dados) {
    return await this.create(dados);
  }

  async delete(id) {
    const query = 'DELETE FROM public.jogador WHERE id = $1;';
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Alias para o Service
  async deletar(id) {
    return await this.delete(id);
  }

  async findByNomeEAltura(nome, altura) {
    const result = await pool.query(
      'SELECT * FROM public.jogador WHERE LOWER(nome) = LOWER($1) AND altura = $2;',
      [nome, altura]
    );
    return result.rows[0];
  }

  async atualizar(id, dados) {
    const { nome, altura, posicao, idade, envergadura, al_ver } = dados;
    const result = await pool.query(
      `UPDATE public.jogador 
       SET nome = $1, altura = $2, posicao = $3, idade = $4, envergadura = $5, al_ver = $6 
       WHERE id = $7 RETURNING *;`,
      [nome, altura, posicao, idade, envergadura, al_ver, id]
    );
    return result.rows[0];
  }
}

module.exports = JogadorRepository;