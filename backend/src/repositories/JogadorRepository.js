const { pool } = require('../config/db');

class JogadorRepository {
  async findAll() {
    const query = 'SELECT * FROM public.jogador ORDER BY id ASC;';
    const { rows } = await pool.query(query);
    return rows;
  }

  async findById(id) {
    const query = 'SELECT * FROM public.jogador WHERE id = $1;';
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
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

  async delete(id) {
    const query = 'DELETE FROM public.jogador WHERE id = $1;';
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }
  async findByNomeEAltura(nome, altura) {
  const result = await pool.query(
    'SELECT * FROM jogador WHERE LOWER(nome) = LOWER($1) AND altura = $2',
    [nome, altura]
  );
  return result.rows[0];
}
}

module.exports = JogadorRepository;