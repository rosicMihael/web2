import { writeFile } from "node:fs/promises";

export async function getToken(
  authority: string,
  audience: string,
  clientId: string,
  clientSecret: string,
  scope: string,
): Promise<string> {
  try {
    const response = await fetch(`${authority}/oauth/token`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        audience: audience,
        grant_type: "client_credentials",
        scope: scope,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return data.access_token;
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error;
  }
}

export async function issuePass(
  url: string,
  token: string,
  name: string,
  document: string,
): Promise<void> {
    try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, document }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
      throw new Error(`Failed to issue pass: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const location = response.headers.get("location");

    if (!location) {
      throw new Error("No location header in response");
    }

    const passId = new URL(location).pathname.split('/').filter(Boolean).pop();

    if (!passId) {
        throw new Error('Could not extract pass ID from Location');
    }

    const image = Buffer.from(await response.arrayBuffer());
    await writeFile(`${passId}.png`, image);

  } catch (error) {
    console.error("Error issuing pass:", error);
    throw error;
  }
}
