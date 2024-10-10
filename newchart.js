let birthData = [];
let deathData = [];
let municipalityCode;

async function fetchBirthAndDeathData(municipalityCode) {
    const url = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
    const query1 = {
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
                    "values": ["vm01"]
                }
            }
        ],
        "response": {
            "format": "json-stat2"
        }
    };
    const query2 = {
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
                    "values": ["vm11"]
                }
            }
        ],
        "response": {
            "format": "json-stat2"
        }
    };

    const births = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(query1),
    });
    const data = await births.json();
    birthData = data.value;

    const deaths = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(query2),
    });
    const data2 = await deaths.json();
    deathData = data2.value;

    createChart(birthData, deathData);
}

function createChart(birthData, deathData) {
    const labels = [...Array(2022 - 2000).keys()].map(i => (2000 + i).toString());
    const chart = new frappe.Chart("#chart", {
        title: "Births and Deaths Data",
        data: {
            labels: labels,
            datasets: [
                {
                    name: "Births",
                    values: birthData,
                },
                {
                    name: "Deaths",
                    values: deathData,
                }
            ]
        },
        type: "bar",
        height: 450,
        colors: ["#63d0ff", "#363636"],
        axisOptions: {
            yAxisMode: 'span', // Set the y-axis mode
            xIsSeries: true // Specify x-axis as series
        },
    });
}

window.onload = function () {
    const municipalityCode = localStorage.getItem("municipalityCode");
    if (municipalityCode) {
        fetchBirthAndDeathData(municipalityCode);
    }
};
