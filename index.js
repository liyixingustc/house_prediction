// Layout Settings
var margin = {top:50, right:50, bottom:0, left:50},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

var histHeight = height/5;


var svg = d3.select("#vis")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.top)


var plot = svg.append("g")
			  .attr("class", "plot")
			  // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			  .attr("transform", "translate(0, 0)");

var x;
var y;
var colors;
var handle;
var dataset;
// Read data from csv file
var xx;
d3.csv("test1.csv", prepare, function(data) {

////////////////////////
// color range
colors = d3.scaleQuantize()
	   		 .domain([0, d3.max(data, function(d) {return d.price;})])
	   		 .range(['#ffc388','#ffa15e','#fd8f5b','#f26c58','#e95b56','#e04b51','#d53a4b', '#bb1d36','#ac0f29', '#8b0000', '#b30000', '#7f0000']);

var aa = 12

x = d3.scaleLinear()
	  .domain([0, d3.max(data, function(d) {return d.price;})])
	  .range([0, width])
	  .clamp(true);

xx = x

// y scale for histogram
y = d3.scaleLinear()
  	  .range([histHeight, 0]);

////  Histogram Set Up  ////

////////TEST
nn = 11
minR= d3.min(data, function(d) {return d.price;});
maxR= d3.max(data, function(d) {return d.price;});
thresh = d3.range(minR, maxR, (maxR-minR)/nn	);
start = [];
prc   = [];
for (var i = 0; i <= nn; i++ ){
	prc.push(minR + (maxR-minR)/nn*i);
}
////////////


// set parameters
var histogram = d3.histogram()
				  .value(function(d) {return d.price;})
				  // .domain(x.domain())
				   .thresholds(thresh);

var hist = svg.append("g")
			  .attr("class", "histogram")
			  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


// group data for bars
var bins = histogram(data);
console.log(bins);

// y domain based on binned data
y.domain([0, d3.max(bins, function(d) {return d.length;})]);

var bar = hist.selectAll(".bar")
			  .data(bins)
			  .enter()
			  .append("g")
			  .attr("class", "bar")
			  // .attr("transform", "translate(50, 50)");
			  .attr("transform", function(d) {
			  	start.push(x(d.x0)); 
			  	return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

bar.append("rect")
   .attr("class", "bar")
   .attr("x", 1)
   .attr("y", 50)
   .attr("width", function(d) {return x(d.x1) - x(d.x0) - 1;})
   // console.log(x(d.x1) - x(d.x0) - 1);
   // .attr("width", function(d) {return (x(d.x1) - x(d.x0))/1000;})
   .attr("height", function(d) {return histHeight - y(d.length);})
   .attr("fill", function(d) {return colors(d.x0);});

bar.append("text")
   .attr("dy", ".75em")
   .attr("y", "50")
   .attr("x", function(d) {return (x(d.x1) - x(d.x0))/2;})
   .attr("text-anchor", "middle")
   .text(function(d) {if (d.length > 5) return d.length;})
   .style("fill", "white");


/////////   Slider   //////////
var currentValue = 0;

var slider = svg.append("g")
				.attr("class", "slider")
				.attr("transform", "translate(" + margin.left + "," + (margin.top + histHeight + 55) + ")");

dataset = data;
drawPlot(dataset);

const brush = d3.brushX()
			  .extent([[0, 0], [width, 40]])
			  .on("brush", brushed);

slider.append("rect")
	  .attr("class", "drag-bar")
	  .attr("x", 0)
	  .attr("y", 0)
	  .attr("width", width)
	  .attr("height", 10)
	  .attr("fill", "#dcdcdc")
	  .attr("rx", 4)
	  .attr("ry", 4);

slider.append("g", ".track-overlay")
	  .attr("class", "ticks")
	  .attr("transform", "translate(0, 18)")
	  .selectAll("text")
	  .data(x.ticks(nn))
	  // .data(bins)
	  .enter()
	  .append("text")
	  .attr("x", x)
	  .attr("y", 10)
	  .attr("text-anchor", "middle")
	  .text(function(d) {return d;});


slider.append("g")
	  .attr("class", "brush")
	  .call(brush)
	  .call(brush.move, x.range());
})


function drawPlot(data) {
	var locations = plot.selectAll(".location")
					    .data(data, function(d) { return d.id;});

	locations.exit().remove();
	// if filtered dataset has more circles than already existing, 
	// transition new ones in
	locations.enter()
			.append("circle")
			.attr("class", "location")
			// .attr("cx", function(d) {return x(d.price) + width/nn;})
			.attr("cx", function(d,i) {
				for (var k=0; k<= prc.length-1; k++){
					if (d.price==prc[k] ||((d.price > prc[k]) && (d.price <= prc[k+1]))){
						break;
					}
				}
				return (start[k]+width/24+margin.left); })
			.attr("cy", function(d) {return Math.random() * ((height/2 + 50) - (height/2 - 50)) + (height/2 - 50) + 50;})
			.style("fill", function(d) {return colors(d.price);})
			.style("stroke", function(d) {return colors(d.price);})
			.style("opacity", 0.3)
			.attr("r", 5)
				.transition()
				.duration(400)
				.attr("r", 15)
					.transition()
					.attr("r", 5);

	// if filtered dataset has less circles than already existing,
	// remove excess
	locations.exit()
			 .remove();
}

function prepare(d) {
	d.price = +d.price;
	d.id = +d.id;
	return d;
}

function brushed() {
	const position = d3.event.selection;
	const min = position[0];
	const max = position[1];
	update(min, max);
}

function update(min, max) {
	const valMin = x.invert(min);
	const valMax = x.invert(max);

	const newData = dataset.filter(function(d) {
		return d.price < valMax && d.price > valMin;
	});

	drawPlot(newData);

	d3.selectAll(".bar")
	  .attr("fill", function(d) {return (d.x0 < valMax && d.x1 > valMin) ? colors(d.x0) : "#eaeaea"});
}









