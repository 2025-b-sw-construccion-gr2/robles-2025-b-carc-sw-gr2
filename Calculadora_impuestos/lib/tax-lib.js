// tax-lib.js
// Biblioteca con funciones para calcular impuestos

// Calcula el IVA (por defecto 12%)
function calcularIVA(monto, tasa = 0.12) {
  return monto * tasa;
}

// Calcula el Impuesto a la Renta (simplificado)
function calcularRenta(salarioAnual) {
  if (salarioAnual <= 11722) return 0;
  else if (salarioAnual <= 14930) return (salarioAnual - 11722) * 0.05;
  else if (salarioAnual <= 18660) return 160 + (salarioAnual - 14930) * 0.10;
  else if (salarioAnual <= 22400) return 606 + (salarioAnual - 18660) * 0.12;
  else return 1230 + (salarioAnual - 22400) * 0.15;
}

// Exportar funciones como librería
module.exports = { calcularIVA, calcularRenta };
