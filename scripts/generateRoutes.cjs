const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const filePath = path.resolve("public/products.xlsx");
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet);

const slugify = (name = "") =>
  name
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const routes = rows.map((p) => {
  const upc = String(p.ProductUPC).replace("#", "").trim();
  const slug = slugify(p.ProductName);
  return `/product/${upc}/${slug}`;
});

fs.writeFileSync("react-snap-routes.json", JSON.stringify(routes, null, 2));

console.log(`✅ Generated ${routes.length} product routes`);
