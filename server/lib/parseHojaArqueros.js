// San Blas 2016 - Arqueros de Valdemorillo
// (c) 2016, Ferimer

'use strict'

var xlsx = require('node-xlsx');

// Filas en las que se encuentra la información
var parapetoNum = 0,
    diana = 1,
    lineaTiro = 2,
    tipoArco = 3,
    genero = 4,
    nombreArquero = 6,
    clubArquero = 7,
    licencia = 9;

module.exports = function parser(hoja) {
  var tablas = xlsx.parse(hoja);

  var arqueros = [];
  var arquero = {};
  tablas.forEach(function(modalidad) {
    var data = modalidad.data;

    for (var col = 0; col < data[lineaTiro].length; col++) {
      if (data[lineaTiro][col] === null) {
        continue;
      }
      if (data[parapetoNum][col] != null) {
        arquero.parapeto = data[parapetoNum][col];
      }
      if (data[tipoArco][col] != null) {
        arquero.modalidad = data[tipoArco][col];
      }
      if (data[genero][col] != null) {
        arquero.genero = data[genero][col];
      }

      arqueros.push({
        parapeto: arquero.parapeto,
        modalidad: arquero.modalidad,
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