const SERVER_URL = "http://localhost:8080/api/"
import { paginator } from "../../lib/paginator/paginate-bootstrap.js"
import { sanitizeStringWithTableRows } from "../../utils.js"
const SIZE = 10
//const TOTAL = Math.ceil(1000 / SIZE)  //Should come from the backend -> fixed to do so at the beginning of the load function.

//useBootStrap(true)

const navigoRoute = "cars-v2"

let cars = [];


let sortField = "brand";
let sortOrder = "desc"


function handleSort(field, pageNo, match) {
  sortOrder = sortOrder == "asc" ? "desc" : "asc";
  sortField = field;
  load(pageNo, match);
}

export async function load(pg, match) {


    document.getElementById("header-id").onclick = function (evt) {
      evt.preventDefault()
      handleSort("id", pageNo, match)
    }
    document.getElementById("header-brand").onclick = function (evt) {
      evt.preventDefault()
      handleSort("brand", pageNo, match)
    }
    document.getElementById("header-model").onclick = function (evt) {
      evt.preventDefault()
      handleSort("model", pageNo, match)
    }
    document.getElementById("header-color").onclick = function (evt) {
      evt.preventDefault()
      handleSort("color", pageNo, match)
    }
    document.getElementById("header-kilometers").onclick = function (evt) {
      evt.preventDefault()
      handleSort("kilometers", pageNo, match)
    }

  const p = match?.params?._page || pg  //To support Navigo
  let pageNo = Number(p)

  let queryString = `?size=${SIZE}&page=` + (pageNo - 1)+ `&sort=${sortField},${sortOrder}&sort=kilometers,desc`

  try {
    cars = await fetch(`${SERVER_URL}cars${queryString}`)
      .then(res => res.json())
  } catch (e) {
    console.error(e)
  }
  const rows = cars.map(car => `
  <tr class="table">
    <td>${car.id}</td>
    <td>${car.brand}</td>
    <td>${car.model}</td>
    <td>${car.color}</td>
    <td>${car.kilometers}</td>
  `).join("")


  //DON'T forget to sanitize the string before inserting it into the DOM
  document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(rows)

  const TOTAL = Math.ceil(await getCount() / SIZE) - 1;

  // (C1-2) REDRAW PAGINATION
  paginator({
    target: document.getElementById("car-paginator"),
    total: TOTAL,
    current: pageNo,
    click: load
  });
  //Update URL to allow for CUT AND PASTE when used with the Navigo Router
  //callHandler: false ensures the handler will not be called again (twice)
  window.router?.navigate(`/${navigoRoute}${queryString}`, { callHandler: false, updateBrowserURL: true })
}

async function getCount(){
  var count = 0;
  try {
    count = await fetch(`${SERVER_URL}cars/count`)
      .then(res => res.json())
  } catch (e) {
    console.error(e)
  }
  return count;
}
