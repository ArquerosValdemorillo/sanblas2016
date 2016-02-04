
var endpoints = {
  host: 'http://sanblas.arquerosvaldemorillo.es',
  hostDev: 'http://localhost:8080',
  arqueros: '/sanblas/v1/arqueros'
};

var arqueros = [],
    scoreUpdated = false;

window.onload = function() {
  document.getElementById('bbdd').onclick = function() {
    location.hash = 'bbddView';
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
      updateResultados();
    };

    xhr.send();
  } else {
    updateResultados();
  }
}

function debugArqueros(element) {
  element.textContent = JSON.stringify(arqueros, null, ' ');
}

function updateResultados() {
  // Prepare table
  var table = document.createElement('table');

  var tr = document.createElement('tr'),
      th = document.createElement('th');
  th.textContent = 'Arquero';
  tr.appendChild(th);
  th = document.createElement('th');
  th.textContent = 'Licencia';
  tr.appendChild(th);
  th = document.createElement('th');
  th.textContent = 'Club';
  tr.appendChild(th);
  th = document.createElement('th');
  th.textContent = 'Ronda 1';
  tr.appendChild(th);
  th = document.createElement('th');
  th.textContent = 'Ronda 2';
  tr.appendChild(th);
  th = document.createElement('th');
  th.textContent = 'Total';
  tr.appendChild(th);
  table.appendChild(tr);

  arqueros.forEach(arquero => {
    tr = document.createElement('tr');

    var td = document.createElement('td');
    td.textContent = arquero.Nombre;
    tr.appendChild(td);

    td = document.createElement('td');
    td.textContent = arquero.Licencia;
    tr.appendChild(td);

    td = document.createElement('td');
    td.textContent = arquero.Club;
    tr.appendChild(td);

    td = document.createElement('td');
    td.textContent = arquero.Ronda1;
    td.contentEditable = true;
    td.id = arquero.Licencia + '_Ronda1';
    td.addEventListener('input', () => updateScore(arquero.Licencia));
    tr.appendChild(td);

    td = document.createElement('td');
    td.textContent = arquero.Ronda2;
    td.contentEditable = true;
    td.id = arquero.Licencia + '_Ronda2';
    td.addEventListener('input', () => updateScore(arquero.Licencia));
    tr.appendChild(td);

    td = document.createElement('td');
    td.id = arquero.Licencia + '_Total';
    tr.appendChild(td);
    var lic = arquero.Licencia;
    setTimeout(() => refreshScore(lic));

    table.appendChild(tr);
  });

  // Update UI
  var contenedor = document.getElementById('viewResultsView');
  contenedor.innerHTML = '';
  contenedor.appendChild(table);
}

function updateScore(licencia) {
  if (!scoreUpdated) {
    setTimeout(saveScores, 10000);
    scoreUpdated = true;
  }
  refreshScore(licencia);
}

function refreshScore(licencia) {
  var R1 = document.getElementById(licencia + '_Ronda1'),
      R2 = document.getElementById(licencia + '_Ronda2'),
      T = document.getElementById(licencia + '_Total');

  T.textContent = parseInt(R1.textContent) + parseInt(R2.textContent);
}

function saveScores() {
  if (scoreUpdated) {
    arqueros.forEach(arquero => {
      arquero.Ronda1 = document.getElementById(
        arquero.Licencia + '_Ronda1').textContent;
      arquero.Ronda2 = document.getElementById(
        arquero.Licencia + '_Ronda2').textContent;
    });

    localStorage.setItem('sanblas', JSON.stringify(arqueros));
    scoreUpdated = false;
    console.log('Scores updated !');
  }
}