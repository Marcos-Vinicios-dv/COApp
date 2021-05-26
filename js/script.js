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
  paises: async () => {
    const url = `https://api.covid19api.com/countries`;
    const response = await fetch(url);
    const listaPaises = await response.json();

    DOM.inserirPaises(listaPaises);

    listaPaises.forEach(pais => {
      paises[pais.Country] = pais.Slug;
    });
  },

  globalDados: async () => {
    const url = `https://api.covid19api.com/summary`;
    const response = await fetch(url);
    const dados = await response.json();

    DOM.mostrarConfirmados(dados.Global.TotalConfirmed);
    DOM.mostrarMortes(dados.Global.TotalDeaths);
    DOM.mostrarRecuperados(dados.Global.TotalRecovered);
    DOM.mostrarAtivos(dados.Global.NewConfirmed)
  },
  
  porPais: async (pais) => {
    const url = `https://api.covid19api.com/country/${pais}`
    const response = await fetch(url);
    const dados = await response.json();

    for (const dia of dados) {
      DOM.mostrarConfirmados(dia.Confirmed);
      DOM.mostrarMortes(dia.Deaths);
      DOM.mostrarAtivos(dia.Active);
      DOM.mostrarRecuperados(dia.Recovered);
    }
  },

  porData: async (data, pais) => {
    const url = `https://api.covid19api.com/country/${pais}?from=2020-03-01T00:00:00Z&to=${data}T00:00:00Z`
    const response = await fetch(url);
    const dados = await response.json();

    for (const dia of dados) {
      DOM.mostrarConfirmados(dia.Confirmed);
      DOM.mostrarMortes(dia.Deaths);
      DOM.mostrarAtivos(dia.Active);
      DOM.mostrarRecuperados(dia.Recovered);
    }
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
