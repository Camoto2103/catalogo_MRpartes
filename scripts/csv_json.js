const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const csvInputPath = path.resolve(__dirname, '../catalogo_mrpartes.csv'); // products.csv en la raíz
const jsonOutputPath = path.resolve(__dirname, '../catalogo_mrpartes.json'); // data/products.json

const products = [];

fs.createReadStream(csvInputPath)
  .pipe(csv())
  .on('data', (row) => {
    // Convertir 'precio' a número
    if (row.precio) {
      row.precio = parseFloat(row.precio);
    }
    products.push(row);
  })
  .on('end', () => {
    fs.writeFile(jsonOutputPath, JSON.stringify(products, null, 4), (err) => {
      if (err) {
        console.error('Error al escribir el archivo JSON:', err);
        return;
      }
      console.log(`Éxito: Datos convertidos de '${csvInputPath}' a '${jsonOutputPath}'`);
      console.log(`Se procesaron ${products.length} productos.`);
    });
  })
  .on('error', (err) => {
    console.error('Error al leer el archivo CSV:', err);
  });