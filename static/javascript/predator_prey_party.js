// Variables
var data;
var preyCount = 4000;
var predatorCount = 90;
var preyReproductionRate = 1.1;
var predatorAttackRate = 0.6;
var conversionEfficiency = 0.2;
var predatorDeathRate = 0.1;
var preyDeathRate = 0.02;
var slider = {
    from: 0,
    to: 10000,
    step: 1,
    realtime: true
}


var archive = [{"predator": predatorCount, "prey": preyCount}];    

function Cell() {
    this.predatorCount = 0;
    this.preyCount = 0;
    this.addPredator = function(){
        this.predatorCount ++;
    }
    this.addPrey = function(){
        this.preyCount ++
    }
    this.removePredator = function(){
        this.predatorCount --
    }
    this.removePrey = function(){
        this.preyCount --
    }
}

// Create the array
function newDataArray() {
    data = _.range(100);
    data.forEach(function(e, row) {
        data[row] =  _.range(100);
        data[row].forEach(function(e, col) {
            data[row][col] = new Cell();
        })
    });
}

// Create the visualization
newDataArray();
initializeData(data, preyCount, predatorCount);
var habitat = d3.select("#habitat");
var timeseries = d3.select("#timeseries");
var animation 
drawData()

// Functions
function step() {
    eraseData();
    preyReproduce(data, preyReproductionRate);
    predatorsEat(data, predatorAttackRate, conversionEfficiency)
    predatorsAndPreyDieNaturalDeaths(data, predatorDeathRate, preyDeathRate)
    var archiveEntry = {"predator": predatorCount, "prey": preyCount}
    archive.push(archiveEntry);
    if (archive.indexOf(archiveEntry) >= 100) { archive.splice(0,1) }
        allMove(data);
    drawData();
    updateView();
}

function initializeData (array, preyCount, predatorCount) {
    for (var i = 0; i < preyCount; i++) { 
        var row = _.random(99),  col = _.random(99)
        array[row][col].addPrey();
    }
    for (var j = 0; j < predatorCount; j++) {
        var row = _.random(99), col = _.random(99);
        array[row][col].addPredator();
    }
}

function preyReproduce (data, preyReproductionRate) {
data.forEach(function(thisRow, row) {
    thisRow.forEach(function(cell, col) {
    _.times(_.cloneDeep(cell.preyCount), 
        function(){
            var reproduce = _.random(0,1,true);
            if (preyReproductionRate >= reproduce + 1) {
                cell.addPrey();
                preyCount ++;
            }
        })
})
})
}

function allMove (data) {
data.forEach(function(thisRow, row) {
    thisRow.forEach(function(cell, col) {
    _.times(_.cloneDeep(cell.preyCount), function(){
        var move = _.random(0,8)
        cell.removePrey()
        nearbyCell(data, row, col, move).addPrey();
    })
    _.times(_.cloneDeep(cell.predatorCount), function(){
        var move = _.random(0,8)
        cell.removePredator();
        nearbyCell(data, row, col, move).addPredator();
    })
})
})
}

function predatorsEat(data, predatorAttackRate, conversionRate) {
data.forEach(function(thisRow, row) {
    thisRow.forEach(function(cell, col) {
        _.times(_.cloneDeep(cell.predatorCount), function(){
            _.times(9, function(n){
                var neighbor = nearbyCell(data, row, col, n)
                _.times(_.cloneDeep(neighbor.preyCount), function(n1){
                    var attack = _.random(0,1,true);
                    if (attack <= predatorAttackRate) {
                        neighbor.removePrey();
                        preyCount --;
                        var reproduce = _.random(0,1,true)
                        if (reproduce <= conversionRate) {
                            cell.addPredator();
                            predatorCount ++;
                        }
                    }
                })
            })
        })
    })
})
}

function predatorsAndPreyDieNaturalDeaths(data, predatorDeathRate, preyDeathRate) {
data.forEach(function(thisRow, row) {
    thisRow.forEach(function(cell, col) {
        _.times(_.cloneDeep(cell.predatorCount), function() {
            var death = _.random(0,1,true)
            if (death <= predatorDeathRate) {
                cell.removePredator();
                predatorCount --;
            }
        })
        _.times(_.cloneDeep(cell.preyCount), function() {
            var death = _.random (0,1,true)
            if (death <= preyDeathRate) {
                cell.removePrey();
                preyCount --;
            }
        })
    })
})
}



function drawData(){
// Array
var rows = habitat.selectAll(".row")
.data(data)
.enter()
.append("g")
.attr("class", "row")
.attr("transform", function(d, i) {return "translate(0," + i * 4 + ")"; })
var cells = rows.selectAll(".cell")
.data(function(d) { return d; })
.enter()
.append("rect")
.attr("class", "cell")
.attr("x", function(d, i) { return i * 4 })
.attr("width", 4)
.attr("height", 4)
.attr("fill", function(d) { return getColor(d) })

// Timeseries
var yScale = d3.scaleLinear()
.range([100, 0])
.domain([0, d3.max([20000, d3.max(archive, function(d){return d.prey}), d3.max(archive, function(d){return d.predator})])])

var lines = timeseries.selectAll(".line")
.data(archive)
.enter()
.append("g")
.attr("class", "line")
lines.append("line")
.attr("x1", function(d, i) { return i * 2 })
.attr("x2", function(d, i) { return (i + 1) * 2 })
.attr("y1", function(d, i) { return yScale(d.predator) })
.attr("y2", function(d, i) { 
    if (archive.length == i + 1) {return yScale(d.predator)} else { return yScale(archive[i+1].predator) }
})
.attr("stroke", "#ff1e1e")
.attr("stroke-width", "1")
lines.append("line")
.attr("x1", function(d, i) { return i * 2 })
.attr("x2", function(d, i) { return (i + 1) * 2})
.attr("y1", function(d, i) { return yScale(d.prey) })
.attr("y2", function(d, i) {
    if (archive.length == i + 1) {return yScale(d.prey)} else { return yScale(archive[i+1].prey) }
})
.attr("stroke", "#009620")
.attr("stroke-width", "1")

}

function eraseData(){
habitat.selectAll(".row").remove();
timeseries.selectAll(".line").remove();
}

function stopAnimation() {
animation.stop()
console.log(archive)
}

function startAnimation() {
animation = d3.interval(step, 500)
}

function resetData() {
newDataArray();
initializeData(data, preyCount, predatorCount);
eraseData()
drawData()
}

function updateTimeseries() {

}

function updateView() {
$("#predatorcount").html(predatorCount)
$("#preycount").html(preyCount)
$("#predatorslider").val(predatorCount)
$("#preyslider").val(preyCount)
}



function nearbyCell(array, row, col, side) {

function up(index) {
    if (index == 99) {
        return 99;
    } else {
        return index + 1;
    }
}
function down(index) {
    if (index == 0) {
        return 0;
    } else {
        return index -1;
    }
}

if (side == 0) {
    return array[row][col];
} else if (side == 1) {
    return array[up(row)][down(col)];
} else if (side ==2) {
    return array[up(row)][col];
} else if (side == 3) {
    return array[up(row)][up(col)];
} else if (side == 4) {
    return array[row][up(col)];
} else if (side == 5) {
    return array[down(row)][up(col)];
} else if (side == 6) {
    return array[down(row)][col];
} else if (side == 7) {
    return array[down(row)][down(col)];
} else if (side == 8) {
    return array[row][down(col)];
}
}

function getColor(cell) {
if ( cell.predatorCount + cell.preyCount == 0 ) {
    return "#cccccc"
} else if ( cell.preyCount > cell.predatorCount ) {
    return "#009620" //green
} else if ( cell.preyCount < cell.predatorCount ) {
        return "#ff1e1e" // red
} else {
    return "#635700"//brown
}
}


$(document).ready(function(){
updateView();
$("#predatorslider").change(function(){predatorCount=$("#predatorslider").val(); $("#predatorcount").html(predatorCount)});
$("#preyslider").change(function(){preyCount=$("#preyslider").val(); $("#preycount").html(preyCount)});
});

