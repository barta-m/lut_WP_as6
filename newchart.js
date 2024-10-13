let birthData = [];
let deathData = [];
let municipalityCode;

function createChart(data1, data2) {
    const chartElement = document.querySelector("#chart");
    const labels = [...Array(2022 - 2000).keys()].map(i => (2000 + i).toString());
    const data = { 
        labels: labels,
        datasets: [
            {
                name: "Births",
                values: data1,
                chartType: "bar"
            },
            {
                name: "Deaths",
                values: data2,
                chartType: "bar"
            }
        ]
    }
    const chart = new frappe.Chart("#chart", {
        title: "Births and Deaths Data",
        data: data,
        type: "bar",
        height: 450,
        colors: ["#63d0ff", "#363636"],
    });
}

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

window.onload = function () {

        const municipalityCode = localStorage.getItem("municipalityCode");
        if (municipalityCode) {
            fetchBirthAndDeathData(municipalityCode);
    }
}
