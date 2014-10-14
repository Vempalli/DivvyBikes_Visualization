var Bikes_DayOfYear = Class.extend({

	construct: function() {
		this.areaMargin = {top: 100, right: 20, bottom: 200, left: 110};
		this.areaCanvasWidth = 1200;
		this.areaCanvasHeight = 150;

		this.areaWidth = 0;
		this.areaHeight = 0;
		
		this.svgarea1 = null;
		
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
	drawAreaChart: function (error, data)
	{
		var width = this.areaCanvasWidth;
		var height = this.areaCanvasHeight;
		var svg = this.svgarea1;
		//var parseDate = d3.time.format("%d/%m/%Y").parse;
		svg.selectAll("*").remove();
		
		/*var x = d3.time.scale()
    		.domain([new Date(data[0].date), d3.time.day.offset(new Date(data[data.length - 1].date), 1)])
    		.rangeRound([0, width - margin.left - margin.right]);*/

		var x = 
		d3.scale.ordinal().rangeRoundBands([0, width], .1);;
		//d3.time.scale().range([0, width]);
		var y = d3.scale.linear()
			.range([height, 0]);
		
		var color = d3.scale.ordinal()
			.range(["#98abc5"]);
		 
		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");
			//.tickFormat(d3.time.format("%d/%m/%Y"));

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.tickFormat(d3.format(".2s"));
		
		
		
		color.domain(d3.keys(data[0])
			.filter(function(key) {return key === "No_Of_Bikes"}));		 
			
		data.forEach(function(d) {
			//d.date = parseDate(d.date);
			d.No_Of_Bikes = +d.No_Of_Bikes;
		});
		 
		//x.domain(d3.extent(data,function(d) { return d.date; }));
		x.domain(data.map(function(d) { return d.Day_of_Year; }));
		y.domain([0, d3.max(data, function(d) { return d.No_Of_Bikes; })]);
		//y.domain(d3.extent(data, function(d) { return d.close; }));
		var area = d3.svg.area()
    		.x(function(d) { return x(d.Day_of_Year); })
    		.y0(height)
    		.y1(function(d) { return y(d.No_Of_Bikes); });
		

		svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
		/*.append("text")
		.selectAll("text")
			.style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-90)")
		//.attr("y", 50)
		//.attr("x", width/2)
		.text("Day of Year");*/
		 
		svg.append("path")
      		.datum(data)
      		.attr("class", "area")
      		.style("fill", "steelblue")
      		.attr("d", area);

		svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -50)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Active Bikes");
		
		svg.selectAll(".chart-title")
			.data(data)
		   .enter()
		   .append("text")
		   .attr("x", width/2)
		   .attr("y", height-200)
		   .attr("text-anchor","middle")
		   .attr("font-family", "sans-serif")
		   .attr("font-size","20pt")
		   .text("Bikes Distribution by Day of Year");
	},


	updateWindow: function ()
	{
		var xWin, yWin;
		
		xWin = d3.select(this.myTag).style("width");
		yWin = d3.select(this.myTag).style("height");

		this.areaWidth = xWin;
		this.areaHeight = yWin;
		
		var totalAreaSizeX = this.areaCanvasWidth+this.areaMargin.left+this.areaMargin.right;
		var totalAreaSizeY = this.areaCanvasHeight+this.areaMargin.top+this.areaMargin.bottom;

		this.svgarea1 = d3.select(this.myTag).append("svg:svg")
				.attr("width", this.areaWidth)
				.attr("height", this.areaHeight)
				.attr("viewBox", "" + -this.areaMargin.left + " 0 " + totalAreaSizeX + " " + this.areaCanvasHeight);
	},

	/////////////////////////////////////////////////////////////

	updateData: function (){	
		var fileToLoad = "App/JsonData/Bikes_DayOfYear_Chicago.json";
		this.inDataCallbackFunc = this.drawAreaChart.bind(this);
		d3.json(fileToLoad, this.inDataCallbackFunc);
	},

	/////////////////////////////////////////////////////////////

	updateScreen: function (){
	  this.updateWindow();
	  this.updateData();
	},
});