import argon2 from "argon2";
import crypto from "crypto";

const hashPassword = async (password: string): Promise<string> => {
    const salt = crypto.randomBytes(16);
    const hash = await argon2.hash(password, { salt });
    return hash;
}

hashPassword("some_pass").then((hashedPassword) => {
    console.log("Hashed password:", hashedPassword);
});