import pool from "../config/db.ts";

export async function getPassByIdService(id: number): Promise<Pass | null> {
  const result = await pool.query(
    `SELECT id, name, document, issued_at, status
         FROM passes
         WHERE id = $1`,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function getAllPassesService(): Promise<Pass[]> {
  const result = await pool.query(
    `SELECT id, name, document, issued_at, status
         FROM passes
         ORDER BY issued_at DESC`,
  );

  return result.rows;
}

export async function getPassCountsService(): Promise<{
  total: number;
  active: number;
}> {
  const result = await pool.query(
    `SELECT
            COUNT(*) AS total,
            COUNT(*) FILTER (WHERE status = 'ACTIVE') AS active
         FROM passes`,
  );

  return {
    total: Number(result.rows[0].total),
    active: Number(result.rows[0].active),
  };
}

export async function createPassService(
  name: string,
  document: string,
): Promise<Pass> {
  const result = await pool.query(
    `INSERT INTO passes (name, document)
         VALUES ($1, $2)
         RETURNING id`,
    [name, document],
  );

  return result.rows[0];
}

export async function cancelPassService(id: number): Promise<Pass | null> {
  const result = await pool.query(
    `UPDATE passes
         SET status = 'CANCELLED'
         WHERE id = $1
         RETURNING id, name, document, issued_at, status`,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function deletePassService(id: number): Promise<boolean> {
  const result = await pool.query(
    `DELETE FROM passes
         WHERE id = $1`,
    [id],
  );

  return (result.rowCount ?? 0) > 0;
}
