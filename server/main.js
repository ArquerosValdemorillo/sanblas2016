#!/usr/bin/env node

// San Blas 2016 - Arqueros de Valdemorillo
// (c) 2016, Ferimer

'use strict'

var rest_server = require('restapi/server'),
    dbManager = require('./lib/databaseManager'),
    fs = require('fs');
var config = null;

if (fs.existsSync('/etc/sanblas/config.json')) {
  config = require('/etc/sanblas/config.json');
} else {
  config = require('./config.json');
}

var api = {
  arqueros: require('./api/arqueros')
};

var realLog = console.log;
console.log = function(msg) {
  realLog('San Blas 2016 Server: ' + msg);
}
console.debug = function(msg, obj) {
  if (!config.debug)
    return;

  if (obj)
     msg += ' ' + JSON.stringify(obj);
  realLog('San Blas 2016 Server [DEBUG]: ' + msg);
}

global.database = new dbManager(config.db);

global.database.connect(function() {
  console.log('Connected to database');
  var server = new rest_server('./sanblas.rdf', {
    port: config.server.port,
    debug: config.debug
  });

  // Wiring
  server['GET sanblas/v1/arqueros'] = api.arqueros.GETArqueros;
  server['POST sanblas/v1/arqueros'] = api.arqueros.POSTArqueros;
  server['GET sanblas/v1/arqueros/:arquero_id'] = api.arqueros.GETArquero;
  server['PUT sanblas/v1/arqueros/:arquero_id'] = api.arqueros.PUTArquero;
  server['DELETE sanblas/v1/arqueros/:arquero_id'] = api.arqueros.DELETEArquero;
  // EOF Wiring
});
