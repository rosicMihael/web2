export function getHome(req: any, res: any) {
  res.render("index", {
    title: "Home",
  });
}