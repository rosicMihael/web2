import pool from "../config/db.ts";

export async function SqlInjection(username: string, password: string): Promise<SqlInjectionResult> {
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    const result = await pool.query(query);
    const is_successful = result.rows.length > 0;
    return {query, result: result.rows, is_successful};
}

export async function Login(username: string, password: string): Promise<boolean> {
    const query = `SELECT * FROM users WHERE username = $1 AND password = $2`;
    const result = await pool.query(query, [username, password]);
    return result.rows.length > 0;
}