// 4G Xtreamer Server
// (c) 2016, Ferimer

'use strict';

var mysql = require('mysql'),
    Promise = require('promise');

module.exports = function DBManager(config) {
  var cfg = config;
  // Promises
  var Query = null; 

  var dbServer = mysql.createConnection({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.passwd,
    database: cfg.schema
  });

  /////////////////////////////////
  // Data validation
  var reNumber = /^\d*$/;
  function isNumber(v) {
    return reNumber.test(v);
  }

  function prepareString(v) {
    return mysql.escape(v);
  }
  /////////////////////////////////

  function _connect(onConnect) {
    dbServer.on('error', function(err) {
      console.log('Database error: ' + err.code);
      process.exit(1);
    });
    dbServer.on('connect', function() {
      // Convert to promises
      Query = Promise.denodeify(dbServer.query.bind(dbServer));

      // All datetimes in UTC
      query('SET time_zone = "+00:00"').then(onConnect);
    });
    dbServer.connect();
  }

  function query(sql) {
    // On DB Error dont reject or not informs client
    console.debug('SQL Query: ' + sql);
    if (!Query) {
      return Promise.reject("Not initialized!");
    }
    return Query(sql).then(function(d) {
      return d;
    }, function(e) {
      console.debug('DB Error: ' + e);
      return '';
    });
  }

  return {
    dataCheck: {
      getNumber: function(v) {
        return isNumber(v) ? v : 0;
      },

      getString: function() {
        return prepareString(v);
      }
    },

    connect: function(onConnect) {
      onConnect = typeof onConnect === 'function' ? onConnect : function() {};
      _connect(onConnect);
    },

    arqueros: {
      getAll: function() {
        return query('SELECT * FROM arqueros');
      },

      get: function(id) {
        return query('SELECT * FROM arqueros WHERE id = ' + id);
      }
    }
  };
};
