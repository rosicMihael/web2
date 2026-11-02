export function getHome(req: any, res: any) {
  res.render("pages/home", {
    title: "Home",
  });
}