// logger.js
// Biblioteca para logs con formato y colores

const chalk = require('chalk');

function logInfo(mensaje) {
  console.log(chalk.cyan(`[INFO] ${mensaje}`));
}

function logSuccess(mensaje) {
  console.log(chalk.greenBright(`[OK] ${mensaje}`));
}

function logError(mensaje) {
  console.error(chalk.red.bold(`[ERROR] ${mensaje}`));
}

function logOperacion(tipo, monto, resultado) {
  const colores = {
    iva: chalk.yellow,
    renta: chalk.magenta
  };
  const color = colores[tipo] || chalk.white;
  console.log(color(`[${tipo.toUpperCase()}] Sobre ${monto} → Resultado: ${resultado.toFixed(2)}`));
}

module.exports = { logInfo, logSuccess, logError, logOperacion };
