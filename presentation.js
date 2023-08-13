function createNodeGraph(jData) {
    document.getElementById("graph").innerHTML = "";
    const sig = window.sig = new sigma({
        renderer: {
            container: document.getElementById("graph"),
            type: 'canvas'
        },
        settings: {
            minArrowSize: 10
        }
    });
    var graph = {nodes: [], edges: []};
        
    for (let i = 0; i < jData.length; i++) {
        graph.nodes.push({
            id:     jData[i].publicKey,
            label:  jData[i].hostname,
            size:   50,
            color:  "blue",
            x:      Math.cos(Math.PI * 2 * i / jData.length - Math.PI / 2), 
            y:      Math.sin(Math.PI * 2 * i / jData.length - Math.PI / 2),
            mcvdata:jData[i],
        });
    }
    for (let i = 0; i < jData.length; i++) {
        for (let j = 0; j < jData[i].quorumSet.validators.length; j++) {
            graph.edges.push({
                id:     i*jData.length + j,
                source: jData[i].publicKey,
                target: jData[i].quorumSet.validators[j],
                color:  "#202020",
                type:   'arrow'
            });
        }
    }
    // mouse over node in graph
    sig.bind('overNode', function(e) {
      var node = e.data.node;
      // set values in floating box
      document.getElementById("tooltipbox_url").innerHTML = node.mcvdata.hostname + ":" + node.mcvdata.port;
      document.getElementById("tooltipbox_latestledger").innerHTML = node.mcvdata.latestLedger;
      document.getElementById("tooltipbox_nation").innerHTML  = node.mcvdata.geoData.countryName;
      document.getElementById("tooltipbox_blockversion").innerHTML = node.mcvdata.ledgerVersion;
      document.getElementById("tooltipbox_minimumfee").innerHTML = node.mcvdata.minimumFee;
      document.getElementById("tooltipbox_publickey").innerHTML = node.mcvdata.publicKey;
      
      document.getElementById("tooltipbox").style.top  = (e.data.captor.clientY - 10)+ "px";
      document.getElementById("tooltipbox").style.left = (e.data.captor.clientX - 10)+ "px";
      document.getElementById("tooltipbox").style.display = "block";
    });
    sig.graph.read(graph);
    sig.refresh();
    // determine circular position of nodes
    sig.startForceAtlas2(); window.setTimeout(function() {sig.killForceAtlas2(); sig.refresh();}, 1000);
}


function presentHistoricalData(dataSheet) {
    makeGLineChart("gchart_nations_graph", aggregateTimeSeries(getNodesTimeSeries(dataSheet, function (data){ return data.geoData.countryName})), "nations");
    makeGLineChart("gchart_blockheight_graph", (getTimeSeries(dataSheet, function(data) {return data.latestLedger;})), "block height", "long");
    makeGLineChart("gchart_fees_graph", (getTimeSeries(dataSheet, function(data) {return data.minimumFee/1000000;})), "minimum transaction fee", "# µMOB");
    makeGLineChart("gchart_reachability_graph", aggregateTimeSeries(getNodesTimeSeries(dataSheet, function (data){ return data.active ? "reachable" : "not reachable";})), "reachable nodes");
}

function makeGLineChart(divID, data, title, notation) {
    let dataTable = new google.visualization.DataTable();
    const columnSet = new Set();
    dataTable.addColumn('string', "time");
    

    if (!Array.isArray(data[Object.keys(data)[0]])) { 
        columnSet.add(title ? title : "value");
    } else {
        {
            let unknownValueFound = false;
            for (const dates of Object.entries(data))
                for (const val of dates[1])
                    if (val[0] == "unknown" && val[1] != 0)
                        unknownValueFound = true;
            if (!unknownValueFound)
                for (const dates of Object.entries(data))
                    for (const val in dates[1])
                        if (dates[1][val][0] == "unknown")
                            dates[1].splice(val, 1);
        }        
        for (let i = 0; i < Object.keys(data).length; i++) {
            for (let j = 0; j < data[Object.keys(data)[i]].length; j++) {
                columnSet.add((data[Object.keys(data)[i]])[j][0].toString());            
            }
        }
    }
    const columnArray = Array.from(columnSet.values());
    for (const item of columnArray) {
        dataTable.addColumn("number", item);
    }
    
    for (let i = 0; i < Object.keys(data).length; i++) {
        inc = Object.keys(data).sort()[i];
        let values = [];
        values.push(inc.substring(0,16));
        if (Array.isArray(data[Object.keys(data)[0]])) {
            data[inc].sort();
            for (let item in columnArray) {
                let pushed = false;
                for (let i = 0; i < data[inc].length; i++) {
                    if (data[inc][i][0] == columnArray[item]) {
                        values.push(data[inc][i][1]);
                        pushed = true;
                    }
                }
                if (!pushed) {
                    values.push(0);
                }
            }
        } else {
            values.push(data[inc]);
        }
        dataTable.addRow(values);
    }
    var options_values = {'title':title ? title : 'title', 'width':'100%', 'height':300, vAxis: {gridlines: {count: 7, interval: 1}, format: notation ? notation : "decimal"}};
    var chart_values = new google.visualization.LineChart(document.getElementById(divID));
    chart_values.draw(dataTable, options_values);
}

function makeGPieChart(divid, title, columnTitle, valueTitle, rows) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', columnTitle);
    data.addColumn('number', valueTitle);
    data.addRows(rows);

    var options = {'title': title, 'width':400, 'height':300};
    var chart = new google.visualization.PieChart(document.getElementById(divid));
    chart.draw(data, options);
}

function presentCurrentData(jData) {
    var activeNodeCount = 0;
    for (let i = 0; i < jData.length; i++) {
            if (jData[i].active) {
                    activeNodeCount +=1;
            }
    }
    makeGPieChart("gchart_active_nodes", "reachablility", "active nodes", "activity", [['active', activeNodeCount], ['not reachable', jData.length - activeNodeCount]]);
    makeGPieChart("gchart_nations", "nations", "nations", "count", aggregate(jData, function(dat) {return dat.geoData.countryName}));
    makeGPieChart("gchart_minimum_fee", "minimum tranaction fee", "version", "count", aggregate(jData, function(dat) {return dat.minimumFee/1000000 + " µMOB"}).sort());
    makeGPieChart("gchart_latest_block", "latest block", "latest block", "count", aggregate(jData, function(dat) {return dat.latestLedger}));
}

document.getElementById("tooltipbox").addEventListener("mouseout", function (){document.getElementById("tooltipbox").style.display="none";});
google.charts.load('current', {'packages':['corechart']});
