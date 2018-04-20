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
// Read data from csv file
var xx;
d3.csv("test1.csv", prepare, function(data) {

////////////////////////
// color range
colors = d3.scaleQuantize()
	   		 .domain([0, d3.max(data, function(d) {return d.price;})])
	   		 .range(['#ffc388','#ffa15e','#fd8f5b','#f26c58','#e95b56','#e04b51','#d53a4b', '#bb1d36','#ac0f29', '#8b0000', '#b30000', '#7f0000']);

// colors = d3.scaleQuantize()
// 			   		 .domain([0, 10000000, 1000000, 2000000, 3000000, 4000000, 5000000, 6000000, 7000000, 8000000, 9000000, 10000000])
// 			   		 .range(['#ffc388', '#ffb269', '#ffa15e','#fd8f5b','#f26c58','#e95b56','#e04b51','#d53a4b', '#bb1d36','#ac0f29', '#8b0000'])

var aa = 12
// x scale for price --------------> ?? linear/ quantile ??
// x = d3.scaleQuantize()
// 	  .domain([d3.min(data, function(d) {return d.price;}), d3.max(data, function(d) {return d.price;})])
// 	  .range([0, width/aa, 2*width/aa, 3*width/aa, 4*width/aa, 5*width/aa, 6*width/aa, 7*width/aa, 8*width/aa, 9*width/aa, 10*width/aa, 11*width/aa]);
// // 		  .clamp(true);


// x = d3.scaleLinear()
// 	  .domain([d3.min(data, function(d) {return d.price;}), d3.max(data, function(d) {return d.price;})])
// 	  .range([0, width])
// 	  .clamp(true);


x = d3.scaleLinear()
	  .domain([0, d3.max(data, function(d) {return d.price;})])
	  .range([0, width])
	  .clamp(true);


xx = x
// x = d3.scaleQuantize()
//    		 .domain([0, 10000000, 1000000, 2000000, 3000000, 4000000, 5000000, 6000000, 7000000, 8000000, 9000000, 10000000])
//    		 .range([width/11, 2*width/11, 3*width/11, 4*width/11, 5*width/11, 6*width/11, 7*width/11, 8*width/11, 9*width/11, 10*width/11, width]);


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


////  Plot Set Up  ////

var dateset;

//// Data Binding  ////

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

dataset = data;
drawPlot(dataset);



/////////   Slider   //////////
var currentValue = 0;

var slider = svg.append("g")
				.attr("class", "slider")
				.attr("transform", "translate(" + margin.left + "," + (margin.top + histHeight + 55) + ")");

slider.append("line")
	  .attr("class", "track")
	  .attr("x1", x.range()[0])
	  .attr("x2", x.range()[1])
	  .select(function() {return this.parentNode.appendChild(this.cloneNode(true));})
	  .attr("class", "track-inset")
	  .select(function() {return this.parentNode.appendChild(this.cloneNode(true));})
	  .attr("class", "track-overlay")
	  .call(d3.drag()
	  	.on("start.interrupt", function() {slider.interrupt();})
	  	.on("start drag", function() {   // ???????????  .drag   ???????????
	  		currentValue = d3.event.x;
	  		// console.log(currentValue);
	  		update(x.invert(currentValue));
	  	}));

slider.insert("g", ".track-overlay")
	  .attr("class", "ticks")
	  .attr("transform", "translate(0," + 18 + ")")
	  .selectAll("text")
	  .data(x.ticks(nn))   //  ?????????????????
	  // .data(bins)
	  .enter()
	  .append("text")
	  .attr("x", x)
	  // .attr("y", 10)
	  .attr("text-anchor", "middle")
	  .text(function(d) {console.log(d); return d;})
	  // .text(function(d) {return d.price;});    //   ???????????

handle = slider.insert("circle", ".track-overlay")
				   .attr("class", "handle")
				   .attr("r", 9);

////////////////////////////////////////

})



function drawPlot(data) {
	var locations = plot.selectAll(".location")
					    .data(data, function(d) { return d.id;});


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


function update(h) {
	handle.attr("cx", x(h));

	// filter data set and redraw plot
	var newData = dataset.filter(function(d) {
		return d.price < h;
	})
	drawPlot(newData);

	// histogram bar colors
	d3.selectAll(".bar")
	  .attr("fill", function(d) {
	  	if (d.x0 < h) {
	  		return colors(d.x0);
	  	} else {
	  		return "#eaeaea";
	  	}
	  })
}



