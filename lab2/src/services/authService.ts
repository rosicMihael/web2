import argon2 from "argon2";
import pool from "../config/db.ts";

export async function SqlInjection(username: string, password: string): Promise<SqlInjectionResult> {
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    const result = await pool.query(query);
    const is_successful = result.rows.length > 0;
    return {query, result: result.rows, is_successful};
}

export async function BrokenAuth(username: string, password: string): Promise<BrokenAuthResult> {
    let correct_username = false;
    let correct_password = false;
    let db_username = "";
    let db_password = "";
    const query_username = `SELECT username FROM users_broken_auth WHERE username = $1`;
    const result_username = await pool.query(query_username, [username]);
    if(result_username.rows.length > 0) {
        db_username = result_username.rows[0].username;
        correct_username = true;
        const query_password = `SELECT password FROM users_broken_auth WHERE username = $1 AND password = $2`;
        const result_password = await pool.query(query_password, [username, password]);
        if(result_password.rows.length > 0) {
            db_password = result_password.rows[0].password;
            correct_password = true;
        }
    }
    return { correct_username, correct_password, db_username, db_password };
}

export async function Login(username: string, password: string): Promise<LoginResult> {
    const query = `SELECT password FROM users WHERE username = $1`;
    const result = await pool.query(query, [username]);
    if (result.rows.length === 0) {
        return { is_valid: false, password_hash: "" };
    }
    const password_hash = result.rows[0].password;
    const is_valid = await argon2.verify(password_hash, password);
    return {is_valid, password_hash};
}