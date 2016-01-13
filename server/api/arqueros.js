// San Blas 2016 - Arqueros de Valdemorillo
// (c) 2016, Ferimer

'use strict'

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
    console.log(JSON.stringify(params.getAll()));
    cb();
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
  }

};