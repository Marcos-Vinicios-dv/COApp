const paises = {};
// ELEMENTOS
const DOM = {
  select: document.getElementById('combo'),
  inserirPaises(data) {
    for (const pais of data) {
      DOM.select.innerHTML += `<option>${pais.Country}</option>`
    }
  },
  inputDate: document.getElementById("today"),
  confirmados: document.getElementById('confirmed'),
  mostrarConfirmados(quantidade) {
    DOM.confirmados.innerHTML = `${Utils.formatValue(quantidade)}`;
  },
  mortes: document.getElementById('death'),
  mostrarMortes(quantidade) {
    DOM.mortes.innerHTML = `${Utils.formatValue(quantidade)}`
  },
  recuperados: document.getElementById('recovered'),
  mostrarRecuperados(quantidade) {
    DOM.recuperados.innerHTML = `${Utils.formatValue(quantidade)}`
  },
  ativos: document.getElementById('active'),
  mostrarAtivos(quantidade) {
    DOM.ativos.innerHTML = `${Utils.formatValue(quantidade)}`
  }
}

//FERRAMENTAS
const Utils = {
  formatValue(value) {
    return value.toLocaleString('pt-BR', { useGrouping: true})
  }
}

// RECUPERAÇÕES DE DADOS
const Recuperar = {
  paises: () => {
    const url = `https://api.covid19api.com/countries`;
    fetch(url)
      .then(response => response.json().then(data => {
        DOM.inserirPaises(data);
        data.forEach(pais => {
          paises[pais.Country] = pais.Slug;
        });
      }))
      
     
  },
  globalDados: () => {
    const url = `https://api.covid19api.com/summary`

    fetch(url)
      .then(response => response.json()
        .then(data => {
          DOM.mostrarConfirmados(data.Global.TotalConfirmed);
          DOM.mostrarMortes(data.Global.TotalDeaths);
          DOM.mostrarRecuperados(data.Global.TotalRecovered);
          DOM.mostrarAtivos(data.Global.NewConfirmed)
        }))
  },
  
  porPais: (pais) => {
    const url = `https://api.covid19api.com/country/${pais}`

    fetch(url).then(response => response.json()
      .then(data => {
        for (const dia of data) {
          DOM.mostrarConfirmados(dia.Confirmed);
          DOM.mostrarMortes(dia.Deaths);
          DOM.mostrarAtivos(dia.Active);
          DOM.mostrarRecuperados(dia.Recovered);
        }
      }))
  },

  porData: (data, pais) => {
    const url = `https://api.covid19api.com/country/${pais}?from=2020-03-01T00:00:00Z&to=${data}T00:00:00Z`

    fetch(url).then(response => response.json()
      .then(data => {
        for (const dia of data) {
          DOM.mostrarConfirmados(dia.Confirmed);
          DOM.mostrarMortes(dia.Deaths);
          DOM.mostrarAtivos(dia.Active);
          DOM.mostrarRecuperados(dia.Recovered);
        }
      }))
  },
 
}

const App = {
  init() {
    // ao iniciar a aplicação
    Recuperar.paises();
    Recuperar.globalDados();
    DOM.select.addEventListener('change', function() {
      if (this.value !== 'Global') {
        Recuperar.porPais(paises[`${this.value}`])
      } else {
        Recuperar.globalDados();
      }
      DOM.inputDate.value = "dd/mm/aaaa"
    })
    DOM.inputDate.addEventListener('change', function() {
      Recuperar.porData(this.value, DOM.select.value);
    })
  },
}

App.init();
