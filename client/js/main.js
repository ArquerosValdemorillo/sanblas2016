
var endpoints = {
  hostProd: 'http://sanblas.arquerosvaldemorillo.es',
  host: 'http://localhost:8080',
  upload: '/sanblas/v1/arqueros'
};

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
};

function sendForm(form) {
  var formData = new FormData(form);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', endpoints.host + endpoints.upload, true);
  xhr.onload = function(e) {
    console.log(this.response);
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