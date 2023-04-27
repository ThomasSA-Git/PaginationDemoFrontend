import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import {
  loadTemplate,
  adjustForMissingHash,
  setActiveLink,
  renderTemplate,

} from "./utils.js"

import { load as loadV2 } from "./pages/cars-bootstrap/cars.js"

window.addEventListener("load", async () => {
  const templateHome = await loadTemplate("./pages/home/home.html")
  const templateCarsBootstrap = await loadTemplate("./pages/cars-bootstrap/cars.html")
  const templateGrid = await loadTemplate("./pages/grid/grid.html")
  const templateGrid2 = await loadTemplate("./pages/grid2/grid2.html")

  const router = new Navigo("/", { hash: true });
  window.router = router

  adjustForMissingHash()
  router
    .hooks({
      before(done, match) {
        setActiveLink("topnav", match.url)
        done()
      }
    })
    .on({
      "/": () => renderTemplate(templateHome, "content"),
      "/cars-v2": (match) => {
        renderTemplate(templateCarsBootstrap, "content")
        loadV2(1, match)
      },
      "/grid": () => {
        renderTemplate(templateGrid, "content")
      },
      "/grid2": () => {
        renderTemplate(templateGrid2, "content")
      }
    })
    .notFound(() => renderTemplate("No page for this route found", "content"))
    .resolve()
});


window.onerror = (e) => alert(e)