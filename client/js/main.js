
var endpoints = {
  host: 'http://sanblas.arquerosvaldemorillo.es',
  hostDev: 'http://localhost:8080',
  arqueros: '/sanblas/v1/arqueros'
};

var arqueros = [],
    scoreUpdated = false;

window.onload = function() {
  var appCache = window.applicationCache;
  appCache.update();

  document.getElementById('bbdd').onclick = function() {
    location.hash = 'bbddView';
  };
  document.getElementById('editResults').onclick = ordenarPorLinea;
  document.getElementById('viewResults').onclick = ordenarPorResultados;

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
    console.log('Recuperamos datos del servidor');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', endpoints.host + endpoints.arqueros, true);
    xhr.responseType = 'json';
    xhr.onload = function(e) {
      arqueros = this.response;
      ordenarPorLinea();
    };

    xhr.send();
  } else {
    console.log('Recuperamos caché local');
    mostrarResultados();
  }
}

function debugArqueros(element) {
  element.textContent = JSON.stringify(arqueros, null, ' ');
}

function ordenarPorLinea() {
  console.log('Ordenamos por linea + diana');
  saveScores();
  arqueros = arqueros.sort((a, b) => {
    return (a.Linea == b.Linea ? a.Diana > b.Diana : a.Linea > b.Linea);
  });
  localStorage.setItem('sanblas', JSON.stringify(arqueros));
  mostrarResultados();
  location.hash = 'viewResultsView';
}

function ordenarPorResultados() {
  console.log('Ordenamos por puntos');
  // Ordenamos por puntos totales
  saveScores();
  arqueros = arqueros.sort((a, b) => {
    var puntosA = a.Ronda1 + a.Ronda2,
        puntosB = b.Ronda1 + b.Ronda2,
        XA = a.X1 + a.X2,
        XB = b.X1 + b.X2;
    return (puntosA == puntosB ? XA < XB : puntosA < puntosB);
  });
  localStorage.setItem('sanblas', JSON.stringify(arqueros));
  mostrarResultados();
  location.hash = 'viewResultsView';
}

function mostrarResultados(filtro) {
  function creaCabecera() {
    // Prepare table
    var table = document.createElement('table');

    var tr = document.createElement('tr'),
        th = document.createElement('th');
    th.textContent = '';
    tr.appendChild(th);
    th = document.createElement('th');
    th.textContent = 'Arquero';
    tr.appendChild(th);
    th = document.createElement('th');
    th.textContent = 'Club';
    tr.appendChild(th);
    th = document.createElement('th');
    th.textContent = 'Ronda 1';
    tr.appendChild(th);
    th = document.createElement('th');
    th.textContent = 'X';
    tr.appendChild(th);
    th = document.createElement('th');
    th.textContent = 'Ronda 2';
    tr.appendChild(th);
    th = document.createElement('th');
    th.textContent = 'X';
    tr.appendChild(th);
    th = document.createElement('th');
    th.textContent = 'Total';
    tr.appendChild(th);
    th = document.createElement('th');
    th.textContent = 'X';
    tr.appendChild(th);
    table.appendChild(tr);

    return table;
  }
  var fila = 1;
  function addArquero(arquero) {
    var tr = document.createElement('tr');

    var td = document.createElement('td');
    td.textContent = arquero.Linea + arquero.Diana;
    tr.appendChild(td);

    td = document.createElement('td');
    td.textContent = arquero.Nombre + ' (' + arquero.Licencia + ')';
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
    td.textContent = arquero.X1;
    td.contentEditable = true;
    td.id = arquero.Licencia + '_X1';
    td.addEventListener('input', () => updateScore(arquero.Licencia));
    td.classList.add('X');
    tr.appendChild(td);

    td = document.createElement('td');
    td.textContent = arquero.Ronda2;
    td.contentEditable = true;
    td.id = arquero.Licencia + '_Ronda2';
    td.addEventListener('input', () => updateScore(arquero.Licencia));
    tr.appendChild(td);

    td = document.createElement('td');
    td.textContent = arquero.X2;
    td.contentEditable = true;
    td.id = arquero.Licencia + '_X2';
    td.addEventListener('input', () => updateScore(arquero.Licencia));
    td.classList.add('X');
    tr.appendChild(td);

    td = document.createElement('td');
    td.id = arquero.Licencia + '_Total';
    td.classList.add('Total');
    tr.appendChild(td);

    td = document.createElement('td');
    td.id = arquero.Licencia + '_XT';
    td.classList.add('X');
    td.classList.add('Total');
    tr.appendChild(td);
    var lic = arquero.Licencia;
    setTimeout(() => refreshScore(lic));

    tr.classList.add( (fila++ % 2 === 0 ? 'par' : 'impar') );

    return tr;
  }

  var table = creaCabecera();
  arqueros.forEach(arquero => {
    if (filtro !== undefined) {
      if(arquero.Modalidad !== filtro)
        return;
    }
    table.appendChild(addArquero(arquero));
  });

  // Update UI
  var contenedor = document.getElementById('viewResultsView');
  contenedor.innerHTML = '';

  var ul = document.createElement('ul');
  var li = document.createElement('li');
  li.textContent = 'TODOS';
  li.onclick = () => mostrarResultados();
  if (filtro === undefined) {
    li.classList.add('active');
  }
  ul.appendChild(li);
  obtenerModalidades().forEach(modalidad => {
    li = document.createElement('li');
    li.textContent = modalidad;
    li.onclick = () => mostrarResultados(modalidad);
    if (filtro === modalidad) {
      li.classList.add('active');
    }
    ul.appendChild(li);
  });

  contenedor.appendChild(ul);
  contenedor.appendChild(table);

  location.hash = 'viewResultsView';
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
      T = document.getElementById(licencia + '_Total'),
      X1 = document.getElementById(licencia + '_X1'),
      X2 = document.getElementById(licencia + '_X2'),
      XT = document.getElementById(licencia + '_XT');

  if (R1 === null || R2 === null || X1 === null || X2 === null) {
    return;
  }
  T.textContent = parseInt(R1.textContent) + parseInt(R2.textContent);
  XT.textContent = parseInt(X1.textContent) + parseInt(X2.textContent);
}

function saveScores() {
  if (scoreUpdated) {
    arqueros.forEach(arquero => {
      arquero.Ronda1 = parseInt(document.getElementById(
        arquero.Licencia + '_Ronda1').textContent);
      arquero.Ronda2 = parseInt(document.getElementById(
        arquero.Licencia + '_Ronda2').textContent);
      arquero.X1 = parseInt(document.getElementById(
        arquero.Licencia + '_X1').textContent);
      arquero.X2 = parseInt(document.getElementById(
        arquero.Licencia + '_X2').textContent);
    });

    localStorage.setItem('sanblas', JSON.stringify(arqueros));
    scoreUpdated = false;
    console.log('Scores updated !');
  }
}

function obtenerModalidades() {
  var modalidades = arqueros.map(arquero => arquero.Modalidad);
  return modalidades.filter((item, pos) => {
    return modalidades.indexOf(item) == pos;
  });
}
