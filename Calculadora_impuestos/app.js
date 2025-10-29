// app.js
// Proyecto principal: Calculadora de Impuestos
const tax = require('./lib/tax-lib');
const logger = require('./lib/logger');
const input = require('./lib/input');

async function main() {
  logger.logInfo("Bienvenido a la Calculadora de Impuestos");

  try {
    const { operacion, valor } = await input.obtenerDatosUsuario();

    switch (operacion) {
      case '1':
        const iva = tax.calcularIVA(valor);
        logger.logOperacion('iva', valor, iva);
        logger.logSuccess(`Total con IVA incluido: ${(valor + iva).toFixed(2)}`);
        break;

      case '2':
        const renta = tax.calcularRenta(valor);
        logger.logOperacion('renta', valor, renta);
        logger.logSuccess(`Impuesto estimado a pagar: ${renta.toFixed(2)}`);
        break;

      default:
        logger.logError("Opción inválida. Intente nuevamente.");
    }
  } catch (error) {
    logger.logError(error.message);
  }
}

main();
