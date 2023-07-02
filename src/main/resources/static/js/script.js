let data = null;
init();
function init(){

    let de = new Date();
    let dateStart = new Date(de.getTime() - 86400000);
    data = getData(dateStart.getTime(), de.getTime());

    document.getElementById('startDate').value = dateToLocalString(dateStart);
    document.getElementById('endDate').value = dateToLocalString(de);

    const ctx = document.getElementById('myChart');

    let chart = new Chart(ctx, {
            type: 'line',
            data:
            {
              labels: [],
              datasets: []
            },
            options: {
            scales: {
              xAxes: [{
                type: 'time',
                time: {
                  displayFormats: {
                      'millisecond': 'MMM DD',
                    'second': 'MMM DD',
                    'minute': 'MMM DD',
                    'hour': 'MMM DD',
                    'day': 'MMM DD',
                    'week': 'MMM DD',
                    'month': 'MMM DD',
                    'quarter': 'MMM DD',
                    'year': 'MMM DD',
                  }
                }
              }],
              y: {
                  beginAtZero: true
              }
            },
          }
          });

    let button = document.getElementById("btn");
    button.onclick = function() {
        let start = new Date(document.getElementById("startDate").value).getTime();
        let end = new Date(document.getElementById("endDate").value).getTime();
        data = getData(start, end);
        updateChart(data, chart);
    }
    let saveButton = document.getElementById("saveRange");
    saveButton.onclick = function() {
        let obj = {
            frequency: document.getElementById("freq").value,
            temperatureMin: document.getElementById("tempmin").value,
            temperatureMax: document.getElementById("tempmax").value,
            humidityMin: document.getElementById("humiditymin").value,
            humidityMax: document.getElementById("humiditymax").value,
            light: document.getElementById("lightmax").value,
            wind: document.getElementById("windmax").value
        };
        let result = JSON.stringify(obj);
        httpPost(result);
    }
    let update = function() {
        updateChart(data, chart);
    }
    document.getElementById("tempcb").onclick = update;
    document.getElementById("humiditycb").onclick = update;
    document.getElementById("lightcb").onclick = update;
    document.getElementById("windcb").onclick = update;
    setInterval(timerFunction, 5 * 1000);
    updateChart(data, chart);
    timerFunction();
    initTable();
}

function dateToLocalString(date) {
    let d = new Date(date.getTime());
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0,19);
}

function initTable() {
    let range = JSON.parse(httpGet("/range"));
    document.getElementById("freq").value = range.frequency;
    document.getElementById("tempmin").value = range.temperatureMin;
    document.getElementById("tempmax").value = range.temperatureMax;
    document.getElementById("humiditymin").value = range.humidityMin;
    document.getElementById("humiditymax").value = range.humidityMax;
    document.getElementById("lightmax").value = range.light;
    document.getElementById("windmax").value = range.wind;
}

function timeFormat(time) {
    let date = new Date(time);
    var dateString =
        date.getUTCFullYear() + "/" +
        ("0" + (date.getUTCMonth()+1)).slice(-2) + "/" +
        ("0" + date.getUTCDate()).slice(-2) + " " +
        ("0" + date.getUTCHours()).slice(-2) + ":" +
        ("0" + date.getUTCMinutes()).slice(-2) + ":" +
        ("0" + date.getUTCSeconds()).slice(-2);

    return dateString;
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function httpPost(obj) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "/updateRange", false);
    xmlHttp.setRequestHeader('Content-type', 'application/json');
    xmlHttp.send(obj);
}

function timerFunction() {
    let tempData = getLastData();
    document.getElementById("templb").textContent = "Температура: " + tempData.temperature + "°С";
    document.getElementById("humiditylb").textContent = "Влажность: " + tempData.humidity + "%";
    document.getElementById("lightlb").textContent = "Освещенность: " + tempData.light + "лк";
    document.getElementById("windlb").textContent = "Скорость потока: " + tempData.wind + "м/с";
    document.getElementById("timelb").textContent = "Дата: " + timeFormat(tempData.date);
}

function getLastData() {
    let path = "/getLast";
    let ans = httpGet(path);
    return JSON.parse(ans);
}

function getData(start, end) {
    let path = "/filter?date=" + start + "&date2=" + end;
    let ans = httpGet(path);
    return JSON.parse(ans);
}

function updateChart(data, chart) {
    let temperatureBoolean = document.getElementById("tempcb").checked;
    let humidityBoolean = document.getElementById("humiditycb").checked;
    let lightBoolean = document.getElementById("lightcb").checked;
    let windBoolean = document.getElementById("windcb").checked;

    let labels = data.map(function (e) {
        return timeFormat(e.date);
    });

    let tempArr = [];
    let humidityArr = [];
    let lightArr = [];
    let windArr = [];
    data.forEach(element => {
        tempArr.push(element.temperature);
        humidityArr.push(element.humidity);
        lightArr.push(element.light);
        windArr.push(element.wind);
    });

    let datasets = [];

    if (temperatureBoolean) {
        let temp = {
            label: 'Температура (°С)',
            data: tempArr,
            borderWidth: 1
        };
        datasets.push(temp);
    }
    if (humidityBoolean) {
        let temp = {
            label: 'Влажность (%)',
            data: humidityArr,
            borderWidth: 1
        };
        datasets.push(temp);
    }
    if (lightBoolean) {
        let temp = {
            label: 'Освещенность (лк)',
            data: lightArr,
            borderWidth: 1
        };
        datasets.push(temp);
    }
    if (windBoolean) {
        let temp = {
            label: 'Скорость потока (м/с)',
            data: windArr,
            borderWidth: 1
        };
        datasets.push(temp);
    }

    chart.data.labels = labels;
    chart.data.datasets = datasets;
    chart.update();
}
