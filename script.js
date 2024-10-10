let currentPopulationData = [];

async function fetchPopulationDataDefault(){
    const url = 'https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px';
    const jsonQuery = {
        "query": [
            {
                "code": "Vuosi",
                "selection": {
                    "filter": "item",
                    "values": [
                        "2000", "2001", "2002", "2003", "2004",
                        "2005", "2006", "2007", "2008", "2009",
                        "2010", "2011", "2012", "2013", "2014",
                        "2015", "2016", "2017", "2018", "2019",
                        "2020", "2021"
                    ]
                }
            },
            {
                "code": "Alue",
                "selection": {
                    "filter": "item",
                    "values": ["SSS"]
                }
            },
            {
                "code": "Tiedot",
                "selection": {
                    "filter": "item",
                    "values": ["vaesto"]
                }
            }
        ],
        "response": {
            "format": "json-stat2"
        }
    };

    const res = await fetch(url, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(jsonQuery),
    });

    const data = await res.json();
    const years = Object.keys(data.dimension.Vuosi.category.label);
    const population = data.value;
    createChart(years, population);
}

async function fetchPopulationData(municipalityCode = "SSS") {
    const url = 'https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px';
    const jsonQuery = {
        "query": [
            {
                "code": "Vuosi",
                "selection": {
                    "filter": "item",
                    "values": [
                        "2000", "2001", "2002", "2003", "2004",
                        "2005", "2006", "2007", "2008", "2009",
                        "2010", "2011", "2012", "2013", "2014",
                        "2015", "2016", "2017", "2018", "2019",
                        "2020", "2021"
                    ]
                }
            },
            {
                "code": "Alue",
                "selection": {
                    "filter": "item",
                    "values": [municipalityCode]
                }
            },
            {
                "code": "Tiedot",
                "selection": {
                    "filter": "item",
                    "values": ["vaesto"]
                }
            }
        ],
        "response": {
            "format": "json-stat2"
        }
    };

    const res = await fetch(url, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(jsonQuery),
    });

    const data = await res.json();
    const years = Object.keys(data.dimension.Vuosi.category.label);
    const population = data.value;
    currentPopulationData = population; 

    createChart(years, population);
}

async function fetchMunicipalityCode(municipalityName) {
    const url = 'https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px';
    const res = await fetch(url);
    const data = await res.json();
    const codes = data.variables[1].values;
    const names = data.variables[1].valueTexts;

    const index = names.findIndex(name => name.toLowerCase() === municipalityName.toLowerCase());
    return codes[index];
}

function addPredictedData() {
    let deltas = [];
    for (let i = 1; i < currentPopulationData.length; i++) {
        deltas.push(currentPopulationData[i] - currentPopulationData[i - 1]);
    }
    const meanDelta = deltas.reduce((sum, delta) => sum + delta, 0) / deltas.length;
    const predictedNextValue = currentPopulationData[currentPopulationData.length - 1] + meanDelta;
    currentPopulationData.push(predictedNextValue);
    const labels = [...Array(2022 - 2000).keys()].map(i => (2000 + i).toString());
    labels.push("2022");

    createChart(labels, currentPopulationData);
}

function createChart(labels, data) {
    const chartElement = document.querySelector("#chart");
    const chart = new frappe.Chart("#chart", {
        title: "Data",
        data: {
            labels: labels,
            datasets: [
                {
                    name: "Population",
                    values: data,
                }
            ]
        },
        type: 'line',
        height: 450,
        colors: ['#eb5146'],
        axisOptions: {
            xAxisMode: 'tick',
            yAxisMode: 'span',
            xIsSeries: true
        }
    });
}

document.getElementById('search-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const municipalityName = document.getElementById('input-area').value;
    const municipalityCode = await fetchMunicipalityCode(municipalityName);
    if (municipalityCode) {
        fetchPopulationData(municipalityCode);
    }
});

document.getElementById('add-data').addEventListener('click', function() {
    addPredictedData();
});

window.onload = fetchPopulationDataDefault();

if (municipalityCode) {
    localStorage.setItem('municipalityCode', municipalityCode);
    fetchPopulationData(municipalityCode);
}

