
import pool from '../config/db.ts';

export async function getPassById(id: number): Promise<Pass | null> {
    const result = await pool.query(
        `SELECT id, name, document, issued_at, status
         FROM passes
         WHERE id = $1`,
        [id]
    );

    return result.rows[0] ?? null;
}

export async function getAllPasses(): Promise<Pass[]> {
    const result = await pool.query(
        `SELECT id, name, document, issued_at, status
         FROM passes
         ORDER BY issued_at DESC`
    );

    return result.rows;
}

export async function getPassCounts(): Promise<{
    total: number;
    active: number;
}> {
    const result = await pool.query(
        `SELECT
            COUNT(*) AS total,
            COUNT(*) FILTER (WHERE status = 'ACTIVE') AS active
         FROM passes`
    );

    return {
        total: Number(result.rows[0].total),
        active: Number(result.rows[0].active),
    };
}

export async function createPass(
    name: string,
    document: string
): Promise<Pass> {
    const result = await pool.query(
        `INSERT INTO passes (name, document)
         VALUES ($1, $2)
         RETURNING id, name, document, issued_at, status`,
        [name, document]
    );

    return result.rows[0];
}

export async function cancelPass(id: number): Promise<Pass | null> {
    const result = await pool.query(
        `UPDATE passes
         SET status = 'CANCELLED'
         WHERE id = $1
         RETURNING id, name, document, issued_at, status`,
        [id]
    );

    return result.rows[0] ?? null;
}

export async function deletePass(id: number): Promise<boolean> {
    const result = await pool.query(
        `DELETE FROM passes
         WHERE id = $1`,
        [id]
    );

    return (result.rowCount ?? 0) > 0;
}
