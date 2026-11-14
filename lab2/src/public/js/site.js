document.getElementById("btnLogin").addEventListener("click", login);

async function login() {
  document.getElementById("content").innerHTML = "";
  document.getElementById("query").textContent = "";
  document.getElementById("result").textContent = "";
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const sql_vulnerable = document.getElementById(
    "btnCheckVulnerabilitySql",
  )?.checked;
  const broken_auth_vulnerable = document.getElementById(
    "btnCheckVulnerabilityBrokenAuth",
  )?.checked;
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
    const data = await response.json();
    document.getElementById("content").innerHTML =
      `${response.status} : ${data.message}`;
    return;
  }
  const data = await response.json();
  if (data.query && data.result) {
    document.getElementById("query").textContent = data.query;
    const resultElement = document.getElementById("result");
    resultElement.innerHTML = "";
    const ul = document.createElement("ul");
    data.result.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = JSON.stringify(item);
      ul.appendChild(li);
    });
    resultElement.appendChild(ul);
  }
  if (data.db_username && data.db_password) {
    document.getElementById("result").textContent = JSON.stringify(
      {
        db_username: data.db_username,
        db_password: data.db_password,
      },
      null,
      2,
    );
  }
  if (data.password_hash && window.location.href.includes("broken_auth")) {
    document.getElementById("result").textContent = data.password_hash;
  }
  document.getElementById("content").innerHTML =
    `${response.status} : ${data.message}`;
}
