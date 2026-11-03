document.getElementById("btnLogin").addEventListener("click", login);

async function login() {
  document.getElementById("content").innerHTML = "";
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const sql_vulnerable = document.getElementById(
    "btnCheckVulnerabilitySql",
  )?.checked;
  const broken_auth_vulnerable = document.getElementById(
    "btnCheckVulnerabilityBrokenAuth",
  )?.checked;
  try {
    const response = await fetch("api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        sql_vulnerable,
        broken_auth_vulnerable,
      }),
    });
    if (!response.ok) {
      document.getElementById("content").innerHTML =
        `${response.status} : ${await response.text()}`;
      return;
    }
    const data = await response.json();
    if (data.query && data.result) {
      document.getElementById("query").textContent = data.query;

      document.getElementById("result").textContent = JSON.stringify(
        data.result,
        null,
        2,
      );
    }
    document.getElementById("content").innerHTML =
      `${response.status} : ${data.message}`;
  } catch (error) {
    document.getElementById("content").innerHTML = error;
  }
}
