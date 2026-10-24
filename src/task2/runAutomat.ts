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

  await issuePass(apiUrl, token, "Janko", "novi zapis");

  console.log("Propusnica je uspješno izdana.");
}

main().catch((error) => {
  console.error("Automat nije uspio:", error);
  process.exitCode = 1;
});
