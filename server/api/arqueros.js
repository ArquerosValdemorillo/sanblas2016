// San Blas 2016 - Arqueros de Valdemorillo
// (c) 2016, Ferimer

'use strict'

var fs = require('fs'),
    parser = require('../lib/parseHojaArqueros');

module.exports = {
  GETArqueros: function(req, res, params, cb) {
    global.database.arqueros.getAll()
    .then(data => {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(data));
      cb();
    });
  },

  POSTArqueros: function(req, res, params, cb) {
    var hoja = params.get('hojaArqueros'),
        arqueros = parser(hoja.path);
    fs.unlink(hoja.path);

    global.database.arqueros.saveAll(arqueros).then(() => {
      res.writeHead(204);
      cb();
    });
  },

  GETArquero: function(req, res, params, cb) {
    global.database.arqueros.get(params.get('id'))
    .then(data => {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(data[0]));
      cb();
    });
  },

  PUTArquero: function(req, res, params, cb) {
    cb();
  },

  DELETEArquero: function(req, res, params, cb) {
    cb();
  },

  OPTIONS: function(req, res, params, cb) {
    res.writeHead(200);
    cb();
  }

};