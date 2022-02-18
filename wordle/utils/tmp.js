const fs = require("fs");

const lang = "fr";
const datos = fs.readFileSync(`./result.fr.csv`,"utf8");

const lineas = datos.split(/[\n\r]/);
let result = "";
lineas.forEach( function (linea) {
    linea = linea.substring(0, 10) + "': '" + linea.substring(10, linea.length);
    result += "'" + linea + "\n";

});

// Para escribir
fs.writeFileSync("./result.txt", result)


