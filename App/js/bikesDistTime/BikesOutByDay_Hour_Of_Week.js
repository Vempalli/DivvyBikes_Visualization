var Bikes_DayOfWeek = Class.extend({

	construct: function() {
		this.barMargin = {top: 100, right: 20, bottom: 200, left: 110};
		this.barCanvasWidth = 1900;
		this.barCanvasHeight = 150;

		this.barWidth = 0;
		this.barHeight = 0;
		
		this.svgBar1 = null;
		this.svgBar2 = null;
		
		this.myTag = "";
	},

	/////////////////////////////////////////////////////////////

	startup: function (whereToRender)
	{
		this.myTag = whereToRender;
		this.updateScreen();
	},

	/////////////////////////////////////////////////////////////

	//Drawing the bar chart for Origin distribution for the first visualization group.	
	drawBarChart1: function (error, data)
	{
		var width = this.barCanvasWidth;
		var height = this.barCanvasHeight;
		var svg = this.svgBar1;
		
		svg.selectAll("*").remove();
				
		var x = d3.scale.ordinal()
			.rangeRoundBands([0, width], .1);
		var y = d3.scale.linear()
			.rangeRound([height, 0]);
		var color = d3.scale.ordinal()
			.range(["#98abc5"]);
		 
		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");
		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.tickFormat(d3.format(".2s"));

		color.domain(d3.keys(data[0])
			.filter(function(key) {return key == "No_Of_Bikes"}));		 
			
		data.forEach(function(d) {
			d.No_Of_Bikes = +d.No_Of_Bikes;
		});
		 
		x.domain(data.map(function(d) { return d.Day; }));
		y.domain([0, d3.max(data, function(d) { return d.No_Of_Bikes; })]);

		svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("y", 50)
		.attr("x", width/2)
		.attr("dx", ".71em")
		.style("text-anchor", "middle")
		.text("Day of Week");
		 
		svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -50)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Active Bikes");
		 
		svg.selectAll("bar")
			.data(data)
			.enter().append("rect")
			.style("fill", "steelblue")
			.attr("x", function(d) { return x(d.Day); })
			.attr("width", x.rangeBand())
			.attr("y", function(d) { return y(d.No_Of_Bikes); })
			.attr("height", function(d) { return height - y(d.No_Of_Bikes); });
		
		svg.selectAll(".chart-title")
			.data(data)
		   .enter()
		   .append("text")
		   .attr("x", width/2)
		   .attr("y", height-200)
		   .attr("text-anchor","middle")
		   .attr("font-family", "sans-serif")
		   .attr("font-size","20pt")
		   .text("Bikes Distribution by Day of Week");
	},

	drawBarChart2: function (error, data)
	{
		var width = this.barCanvasWidth;
		var height = this.barCanvasHeight;
		var svg = this.svgBar2;
		
		svg.selectAll("*").remove();
				
		var x = d3.scale.ordinal()
			.rangeRoundBands([0, width], .1);
		var y = d3.scale.linear()
			.rangeRound([height, 0]);
		var color = d3.scale.ordinal()
			.range(["#98abc5"]);
		 
		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");
		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.tickFormat(d3.format(".2s"));

		color.domain(d3.keys(data[0])
			.filter(function(key) {return key == "No_Of_Bikes"}));		 
			
		data.forEach(function(d) {
			d.No_Of_Bikes = +d.No_Of_Bikes;
		});
		 
		x.domain(data.map(function(d) { return d.Hour; }));
		y.domain([0, d3.max(data, function(d) { return d.No_Of_Bikes; })]);

		svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("y", 50)
		.attr("x", width/2)
		.attr("dx", ".71em")
		.style("text-anchor", "middle")
		.text("Hour of Day");
		 
		svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -50)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Active Bikes");
		 
		svg.selectAll("bar")
			.data(data)
			.enter().append("rect")
			.style("fill", "steelblue")
			.attr("x", function(d) { return x(d.Hour); })
			.attr("width", x.rangeBand())
			.attr("y", function(d) { return y(d.No_Of_Bikes); })
			.attr("height", function(d) { return height - y(d.No_Of_Bikes); });
		
		svg.selectAll(".chart-title")
			.data(data)
		   .enter()
		   .append("text")
		   .attr("x", width/2)
		   .attr("y", height-200)
		   .attr("text-anchor","middle")
		   .attr("font-family", "sans-serif")
		   .attr("font-size","20pt")
		   .text("Bikes Distribution by Hour of Day");	},

	updateWindow: function ()
	{
		var xWin, yWin;
		
		xWin = d3.select(this.myTag).style("width");
		yWin = d3.select(this.myTag).style("height");

		this.barWidth = xWin;
		this.barHeight = yWin;
		
		var totalBarSizeX = this.barCanvasWidth+this.barMargin.left+this.barMargin.right;
		var totalBarSizeY = this.barCanvasHeight+this.barMargin.top+this.barMargin.bottom;

		switch(this.myTag){
			case "#barchart1":
				this.svgBar1 = d3.select(this.myTag).append("svg:svg")
				.attr("width", this.barWidth)
				.attr("height", this.barHeight)
				.attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
				break;
			case "#barchart2":
				this.svgBar2 = d3.select(this.myTag).append("svg:svg")
				.attr("width", this.barWidth)
				.attr("height", this.barHeight)
				.attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
				break;
			}
	},

	/////////////////////////////////////////////////////////////

	updateData: function (){	
		switch(this.myTag){
			case "#barchart1":
				var fileToLoad = "json/bikesDistTime/BikesOutByDayOfWeek_Chicago.csv";
				this.inDataCallbackFunc = this.drawBarChart1.bind(this);
				d3.csv(fileToLoad, this.inDataCallbackFunc);
				break;
			case "#barchart2":
				var fileToLoad = "json/bikesDistTime/BikesOutByHourOfDay_Chicago.csv";
				this.inDataCallbackFunc = this.drawBarChart2.bind(this);
				d3.csv(fileToLoad, this.inDataCallbackFunc);
				break;
		}
	},

	/////////////////////////////////////////////////////////////

	updateScreen: function (){
	  this.updateWindow();
	  this.updateData();
	},
});