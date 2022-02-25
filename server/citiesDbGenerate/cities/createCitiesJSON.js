const fs = require("fs");
const path = require("path");
const simdjson = require("simdjson");
const createCitiesJSON = () => {
  let dir = path.dirname(require.main.filename);
  const regions = simdjson.parse(
    fs.readFileSync(`${dir}/regions/regions.json`)
  );
  let cities = simdjson.parse(
    fs.readFileSync(`${dir}/cities/Ek_atte.json`).toString()
  );
  let cities2 = [];
  cities.forEach((city) => {
    for (let i = 0; i < regions.length; i++) {
      if (regions[i].region === city["oblast"]) {
        city["oblast"] = regions[i].name;
        break;
      }
    }
    cities2.push({
      type: city["t_v_m"],
      name: city["name"],
      municipality: city["obstina"],
      region: city["oblast"],
    });
  });
  fs.writeFileSync(`${dir}/cities/cities.json`, JSON.stringify(cities2));
  return cities2;
};
module.exports = createCitiesJSON;
