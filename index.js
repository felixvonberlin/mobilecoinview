function fetchApiData(start, end) {
    const promises = [];
    var increase = undefined;
    // determine time of crawls for historical view
    if (end - start > 1000* 60 * 60 * 24 * 30 * 3) {
        increase = function (tm) {
            tm.setUTCDate(tm.getUTCDate() + 1);
            return tm;
        }
    } else {
        increase = function (tm) {
            tm.setHours(tm.getHours() + 1);
            return tm; 
        }
    }
    for (let day = start; day <= end; increase(day)) {
        promises.push(fetch("https://api.crawler.mc.trudi.group/v1/" +day.toISOString()).then((response) => (response.json())));
        //promises.push(fetch("http://192.168.178.10:5000/v1/" +day.toISOString()).then((response) => (response.json())));
    }
    
    Promise.all(promises).then(function (data) {
        createNodeGraph(data[data.length - 1].nodes);
        presentHistoricalData(data);
        google.charts.setOnLoadCallback(function () {presentCurrentData(data[data.length - 1].nodes);});
        document.getElementById("overlay").style.display = "none";
    });
}

function loadData(time) {
    document.getElementById("overlay").style.display = "block";
    var startPoint = new Date("2023-06-14T10:00:01.686263346+00:00");
    startPoint.setMinutes(0);
    startPoint.setSeconds(2);
    switch (time) {
        case 'day'  :
            startPoint.setUTCDate(startPoint.getUTCDate() - 1);
            break;
        case 'week' :
            startPoint.setUTCDate(startPoint.getUTCDate() - 7);
            break;
        case 'month':
            startPoint.setMonth(startPoint.getMonth() - 1);
            break;
        case 'month3':
            startPoint.setMonth(startPoint.getMonth() - 1);
            startPoint.setMonth(startPoint.getMonth() - 1);
            startPoint.setMonth(startPoint.getMonth() - 1);
            break;
        case 'year' :
            startPoint.setFullYear(startPoint.getFullYear() - 1);
            break;
        case 'all'  :
        default     :
            startPoint =  new Date("2021-08-23T20:00:00.007Z");
    }
    console.log(new Date("2023-06-14T10:00:01.686263346+00:00"), startPoint, new Date("2023-06-14T10:00:01.686263346+00:00") - startPoint);
    fetchApiData(startPoint, new Date("2023-06-14T10:00:01.686263346+00:00"));
}


document.getElementById("time_selector").addEventListener("change", function(e) {loadData(e.target.value);});
document.getElementById("time_selector").value = "day";
loadData("day");
