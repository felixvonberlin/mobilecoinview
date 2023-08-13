function getTimeSeries(dataList, getFieldFunction) {
    timeseries = [];
    for (let it = 0; it < dataList.length; it++) { timeseries[dataList[it]['timestamp']] = getFieldFunction(dataList[it]);}
    return timeseries;
}

function getNodesTimeSeries(dataList, getFieldFunction) {
    timeseries = [];
    for (let it = 0; it < dataList.length; it++) {
        let data = dataList[it];
        
        let timeddata = [];
        for (let nc = 0; nc < data.nodes.length; nc++) {
            timeddata.push(getFieldFunction(data.nodes[nc]));
        }
        timeseries[data['timestamp']] = timeddata;
    }
    return timeseries;
}

function aggregateI (cutout) {
    return aggregate(cutout, function (data) {return data;});
}

function aggregate (cutout, getDataFunc) {
    var dict = {"unknown" : 0};
    for (i in cutout) {
        let val = getDataFunc(cutout[i]);
        if (val) {
            if (Object.keys(dict).includes(val)) {  dict[val] += 1;
            } else {                                dict[val] = 1; }
        } else { dict['unknown'] += 1; }
    }
    return Object.entries(dict);
}

function aggregateTimeSeries(timeseries) {
    for (series in timeseries) { timeseries[series] = aggregateI(timeseries[series]); }
    return timeseries;
}

  
