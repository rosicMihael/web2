export async function getHome(req: any, res: any) {
  res.render("index", {
    title: "Home",
  });
}

export async function getSqlInjection(req: any, res: any) {
  res.render("sql_injection", {
    title: "SQL Injection",
  });
}

export async function getBrokenAuth(req: any, res: any) {
  res.render("broken_auth", {
    title: "Broken Authentication",
  });
}