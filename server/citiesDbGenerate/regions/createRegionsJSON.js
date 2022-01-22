const fs = require("fs");
const path = require("path");
const createRegionsJSON = () => {
  let dir = path.dirname(require.main.filename);
  let regions = JSON.parse(
    fs.readFileSync(`${dir}/regions/Ek_obl.json`).toString()
  );
  let regions2 = [];
  regions.forEach((city) => {
    regions2.push({
      name: city["name"],
      region: city["oblast"],
    });
  });
  fs.writeFileSync(`${dir}/regions/regions.json`, JSON.stringify(regions2));
  return regions2;
};
module.exports = createRegionsJSON;
