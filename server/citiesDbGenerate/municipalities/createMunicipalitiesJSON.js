const fs = require("fs");
const path = require("path");
const simdjson = require("simdjson");
const createMunicipalitiesJSON = () => {
  let dir = path.dirname(require.main.filename);
  let municipalities = simdjson.parse(
    fs.readFileSync(`${dir}/municipalities/Ek_obst.json`).toString()
  );
  let municipalities2 = [];
  municipalities.forEach((city) => {
    municipalities2.push({
      name: city["name"],
      municipality: city["obstina"],
    });
  });
  fs.writeFileSync(
    `${dir}/municipalities/municipalities.json`,
    JSON.stringify(municipalities2)
  );
  return municipalities2;
};
module.exports = createMunicipalitiesJSON;
