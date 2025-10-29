// input.js
const readline = require('readline');

function obtenerDatosUsuario() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log("\nOperaciones disponibles:");
    console.log("1. Calcular IVA");
    console.log("2. Calcular Impuesto a la Renta");

    rl.question("Seleccione una opción (1 o 2): ", (opcion) => {
      rl.question("Ingrese el monto o salario anual: ", (valor) => {
        rl.close();
        resolve({
          operacion: opcion,
          valor: parseFloat(valor)
        });
      });
    });
  });
}

module.exports = { obtenerDatosUsuario };
