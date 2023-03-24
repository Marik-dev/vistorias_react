export const setores_abastecimento = {
  macromedidores: [
    {
      setorabast: "ETA SEDE",
      municipio: "REGISTRO",
      setor: "RRDO2",
      latitude: "-24.489864",
      longitutde: "-47.842286",
      horimetro: "0",
    },
    {
      setorabast: "ARAPONGAL",
      municipio: "REGISTRO",
      setor: "RRDO2",
      latitude: null,
      longitutde: null,
      horimetro: "0",
    },
    {
      setorabast: "CASTELINHO",
      municipio: "REGISTRO",
      setor: "RRDO2",
      latitude: null,
      longitutde: null,
      horimetro: "0",
    },
    {
      setorabast: "SERROTE POÇO",
      municipio: "REGISTRO",
      setor: "RRDO2",
      latitude: "-24.407039",
      longitutde: "-47.747654",
      horimetro: "1",
    },
    {
      setorabast: "SERROTE BOOSTER",
      municipio: "REGISTRO",
      setor: "RRDO2",
      latitude: null,
      longitutde: null,
      horimetro: "1",
    },
    {
      setorabast: "WINTENIS",
      municipio: "REGISTRO",
      setor: "RRDO2",
      latitude: "-24.484111977573302",
      longitutde: " -47.855774760246284",
      horimetro: "0",
    },
    {
      setorabast: "BOA VISTA",
      municipio: "REGISTRO",
      setor: "RRDO2",
      latitude: "-24.479425142123972",
      longitutde: "-47.858977317810066",
      horimetro: "1",
    },
    {
      setorabast: "HATORI",
      municipio: "REGISTRO",
      setor: "RRDO2",
      latitude: "-24.494169309376144",
      longitutde: "-47.85784629946116",
      horimetro: "0",
    },
    {
      setorabast: "SÃO CONRADO",
      municipio: "REGISTRO",
      setor: "RRDO2",
      latitude: null,
      longitutde: null,
      horimetro: "0",
    },
    {
      setorabast: "PLANALTO",
      municipio: "REGISTRO",
      setor: "RRDO2",
      latitude: "-24.49955936949988",
      longitutde: "-47.854160065196545",
      horimetro: "0",
    },
    {
      setorabast: "PALM PARK",
      municipio: "REGISTRO",
      setor: "RRDO2",
      latitude: "-24.518717872052452",
      longitutde: "-47.865538968094036",
      horimetro: "0",
    },
    {
      setorabast: "AGROCHA 2 E 3",
      municipio: "REGISTRO",
      setor: "RRDO2",
      latitude: "-24.52898202472279",
      longitutde: "-47.88022845983506",
      horimetro: "0",
    },
    {
      setorabast: "AGROCHA",
      municipio: "REGISTRO",
      setor: "RRDO2",
      latitude: "-24.505518194064546",
      longitutde: "-47.8601734425899",
      horimetro: "0",
    },
    {
      setorabast: "CECAP",
      municipio: "REGISTRO",
      setor: "RRDO2",
      latitude: "-24.50342377444569",
      longitutde: "-47.853787200385355",
      horimetro: "0",
    },
    {
      setorabast: "ESPERANÇA",
      municipio: "REGISTRO",
      setor: "RRDO2",
      latitude: "-24.511799904205656",
      longitutde: "-47.85081876317252",
      horimetro: "0",
    },
    {
      setorabast: "SASSAKI",
      municipio: "REGISTRO",
      setor: "RRDO2",
      latitude: "-24.5014188013708",
      longitutde: "-47.845244407653816",
      horimetro: "0",
    },
    {
      setorabast: "PONTE BR-116",
      municipio: "REGISTRO",
      setor: "RRDO2",
      latitude: "-24.490429164922823",
      longitutde: "-47.83561527729035",
      horimetro: "0",
    },
    {
      setorabast: "CARAPIRANGA",
      municipio: "REGISTRO",
      setor: "RRDO2",
      latitude: "-24.511826395694143",
      longitutde: "-47.850837449785665",
      horimetro: "0",
    },
    {
      setorabast: "SUPREMO",
      municipio: "REGISTRO",
      setor: "RRDO2",
      latitude: null,
      longitutde: null,
      horimetro: "0",
    },
    {
      setorabast: "SERROTE POÇO 05 (NOVO)",
      municipio: "REGISTRO",
      setor: "RRDO2",
      latitude: null,
      longitutde: null,
      horimetro: "1",
    },
    {
      setorabast: "SERROTE SAÍDA RESERVA",
      municipio: "REGISTRO",
      setor: "RRDO2",
      latitude: null,
      longitutde: null,
      horimetro: "0",
    },
    {
      setorabast: "",
      municipio: "APIAÍ",
      setor: "RRDO6",
      latitude: null,
      longitutde: null,
      horimetro: "0",
    },
    {
      setorabast: "",
      municipio: "JUQUITIBA",
      setor: "RRDO2",
      latitude: null,
      longitutde: null,
      horimetro: "0",
    },
    {
      setorabast: "",
      municipio: "SETE BARRAS",
      setor: "RRDO2",
      latitude: null,
      longitutde: null,
      horimetro: "0",
    },
    {
      setorabast: "",
      municipio: "SÃO LOURENÇO",
      setor: "RRDO2",
      latitude: null,
      longitutde: null,
      horimetro: "0",
    },
    /*
    {
      setorabast: "ETE Arapongal",
      municipio: "REGISTRO",
      setor: "RRDO2",
      latitude: null,
      longitutde: null,
      horimetro: "0",
    },
    */
  ],
};

export async function getSetores() {
  let setores_abastecimento_fetch = [];

  fetch(
    "https://localsig.com/sabesp_rr/app/api_react/macromedidor/setores_abastecimento.php",
    {
      method: "GET",
    }
  )
    .then((f) => f.json())
    .then((res) => {
      setores_abastecimento_fetch = res;
      console.log("Fullfilled");
      return setores_abastecimento_fetch;
    })
    .catch((e) => {
      console.log("Deu erro no fetch dos setores");
      return setores_abastecimento;
    })
    .then(() => console.log("Terminou o fetch;"));
}
