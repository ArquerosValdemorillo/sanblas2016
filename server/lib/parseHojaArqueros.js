// San Blas 2016 - Arqueros de Valdemorillo
// (c) 2016, Ferimer

'use strict'

var xlsx = require('node-xlsx');

// Filas en las que se encuentra la información
var parapetoNum = 2,
    diana = 3,
    lineaTiro = 4,
    tipoArco = 5,
    genero = 6,
    nombreArquero = 7,
    clubArquero = 15,
    licencia = 17;

module.exports = function parser(hoja) {
  var tablas = xlsx.parse(hoja);

  var arqueros = [];
  var arquero = {};
  tablas.forEach(function(modalidad) {
    if (modalidad.name === 'Medallas') return;

    var data = modalidad.data;
    arquero.modalidad = modalidad.name;

    for (var col = 0; col < data[lineaTiro].length; col++) {
      if (data[lineaTiro][col] === null) {
        continue;
      }
      if (data[parapetoNum][col] !== null) {
        arquero.parapeto = data[parapetoNum][col];
      }
      if (data[tipoArco][col] !== null) {
        arquero.tipoArco = data[tipoArco][col];
      }
      if (data[genero][col] !== null) {
        arquero.genero = data[genero][col];
      }

      arqueros.push({
        parapeto: arquero.parapeto,
        tipoArco: arquero.tipoArco,
        genero: arquero.genero,
        linea: data[lineaTiro][col] || '',
        nombre: data[nombreArquero][col] || '',
        club: data[clubArquero][col] || '',
        licencia: data[licencia][col] || '',
        diana: data[diana][col] || ''
      });
    }
  });

  return arqueros;
}