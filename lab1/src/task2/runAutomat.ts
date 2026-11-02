import { getToken, issuePass } from "./automat.js";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const authority = process.env.ISSUER_BASE_URL!;
  const audience = process.env.AUDIENCE!;
  const clientId = process.env.M2M_CLIENT_ID!;
  const clientSecret = process.env.M2M_CLIENT_SECRET!;
  const scope = "create:passes";

  const apiUrl = `https://lab1-aou8.onrender.com/api/passes`;

  const token = await getToken(
    authority,
    audience,
    clientId,
    clientSecret,
    scope,
  );

  await issuePass(apiUrl, token, "Ivan", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Stjepan", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Ana", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Valentina", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Josip", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Franka", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Krešimir", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Mislav", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Petar", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Pavao", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Snježana", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Hana", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Oskar", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Jakov", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Petra", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Ema", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Ivo", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Martin", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Luka", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Patrik", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Larisa", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Vanesa", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Gorana", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Matija", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Ariana", "Ne diraj molim lijepo!");
  await issuePass(apiUrl, token, "Dragica", "Ne diraj molim lijepo!");

  // ovo sam dodal tak da ima nekaj u bazi, please dont judge nadam se da je dovoljno :)

  console.log("Propusnice uspješno izdane.");

  let ids = [6, 8, 9, 10, 12, 14, 15, 16, 18, 20];

  for (const id of ids) {
    const pass = await fetch(`${apiUrl}/${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await pass.json();

    console.log("Propusnica primljena: ", data);
  }
}

main().catch((error) => {
  console.error("Automat nije uspio:", error);
  process.exitCode = 1;
});
