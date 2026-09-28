
const { pool } = require('../config/db');

class SequenciaTreinoRepository {
  async findAll() {
    const query = 'SELECT * FROM public.sequencia_treino ORDER BY id ASC;';
    const { rows } = await pool.query(query);
    return rows;
  }

  async findById(id) {
    const query = 'SELECT * FROM public.sequencia_treino WHERE id = $1;';
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }

  async create(dados) {
    const query = `
      INSERT INTO public.sequencia_treino (dia, tipo, treino)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [
      dados.dia,
      dados.tipo,
      dados.treino,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async delete(id) {
    const query = 'DELETE FROM public.sequencia_treino WHERE id = $1;';
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}

module.exports = SequenciaTreinoRepository;