
var endpoints = {
  host: 'http://sanblas.arquerosvaldemorillo.es',
  hostDev: 'http://localhost:8080',
  arqueros: '/sanblas/v1/arqueros'
};

var arqueros = [];

window.onload = function() {
  document.getElementById('import').onclick = function() {
    location.hash = 'importView';
  };
  document.getElementById('set').onclick = function() {
    location.hash = 'setView';
  };
  document.getElementById('viewResults').onclick = function() {
    location.hash = 'viewResultsView';
  };

  setTimeout(loadArqueros);
};

function sendForm(form) {
  var formData = new FormData(form);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', endpoints.host + endpoints.arqueros, true);
  xhr.onload = function(e) {
    setTimeout(() => loadArqueros(true));
  };

  var progressBar = document.querySelector('progress');
  xhr.upload.onprogress = function(e) {
    if (e.lengthComputable) {
      progressBar.value = (e.loaded / e.total) * 100;
      progressBar.textContent = progressBar.value + '% completado';
    }
  };

  xhr.send(formData);

  return false; // Prevent page from submitting.
}

function loadArqueros(force) {
  try {
    arqueros = JSON.parse(localStorage.getItem('sanblas'));
  } catch(e) {
    arqueros = null;
  }

  if (Array.isArray(arqueros) === false || force === true) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', endpoints.host + endpoints.arqueros, true);
    xhr.responseType = 'json';
    xhr.onload = function(e) {
      localStorage.setItem('sanblas', JSON.stringify(this.response));
      arqueros = this.response;
    };

    xhr.send();
  }
}
