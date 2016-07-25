


var pieChartViewer = function(containerDiv, canvas, data, column, name, catergories, aspect, maxDiameter, tooltipContainer) {
    "use strict";

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Properties
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	this.containerDiv = d3.select(containerDiv); 

	this.tooltipContainerDiv = d3.select(tooltipContainer);

	this.width = this.containerDiv.node().getBoundingClientRect().width;
	this.height = this.containerDiv.node().getBoundingClientRect().height;

 	this.canvas = canvas || { width:this.width,
 							 height:this.height};

    this.aspect = aspect || (this.canvas.width / this.canvas.height);

	this.color = d3.scale.category20();

	this.radius = Math.min(this.canvas.width, this.canvas.height) / 2;

	this.maxDiameter = maxDiameter;

	this.cornerRadius = 10;
	this.padAngle = 0.03;

    var that = this;

	try{
		this.domContainerDiv = containerDiv || function(){throw "container is not set."}();
		this.rawData = data || function(){throw "data is not set."}();
		this.column = column || function(){throw "column is not set."}();
	}catch(err){
		console.log(err);
	}


    this.subContainerTitle = this.containerDiv.append("div");
    this.subContainerDiv = this.containerDiv.append("div");     
    this.tooltip = this.tooltipContainerDiv.append('div').attr('class', 'pietooltip');

    //this.tooltip.total = 0;

    this.name = name || {};
    this.catergories = catergories || {};

    this.hasCatergories = !jQuery.isEmptyObject(that.catergories);

    
    this.precessedData = {};//store the preprocessed data 
    this.pieChartTitle = [];//the title shown on pie chart
    this.numOfTitle = 0;

	this.arc = d3.svg.arc()
	    .outerRadius(this.radius - 10)
	    .innerRadius(this.radius - 80)
	    .cornerRadius(this.cornerRadius);

	this.labelArc = d3.svg.arc()
	    .outerRadius(this.radius - 40)
	    .innerRadius(this.radius - 40);

	this.pie = d3.layout.pie()
	    .sort(null)
	    .padAngle(this.padAngle)
	    .value(function(d) {return d.value; });
        
	this.legendRectSize = 18;
	this.legendSpacing = 4;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Methods
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     /**
     * 
     * draw pie chart
     * @public
     */
 	this.drawPieChart = function() {
 		that._dataPreprocess();

 		that.subContainerTitle.remove();
        that.subContainerTitle = that.containerDiv.append("div");

        //Remove previously drawn elements from the container DIV
        that.subContainerDiv.remove();
        that.subContainerDiv = that.containerDiv.append("div");



        that._drawSvg();
        that._drawPieChart();
        that._setTooltip(that.name);
 	}

    /**
     * 
     * pie chart animation. Display different Pie
     * @public
     */
 	this.animatePieChart = function(name) {
		that._change(name);
 	}

 	 /**
     * 
     * redraw piechart when window resize
     * @public
     */
 	this.onSizeChange = function(){
		var targetWidth = that.containerDiv.node().getBoundingClientRect().width;
		if(maxDiameter<targetWidth){
			that.containerDiv.attr("width", maxDiameter);
			that.containerDiv.attr("height", maxDiameter / that.aspect);
			that.canvas.width = maxDiameter;
			that.canvas.height = maxDiameter / that.aspect;
		}else{
			that.containerDiv.attr("width", targetWidth);
			that.containerDiv.attr("height", targetWidth / that.aspect);
			that.canvas.width = targetWidth;
			that.canvas.height = targetWidth / that.aspect;
		}
		
		that.radius = Math.min(that.canvas.width, that.canvas.height) / 2;


		that.subContainerTitle.remove();
        that.subContainerTitle = that.containerDiv.append("div");

		that.subContainerDiv.remove();
		//that.tooltip.remove();
        that.subContainerDiv = that.containerDiv.append("div");



        this.arc = d3.svg.arc()
		    .outerRadius(that.radius - 10)
		    .innerRadius(this.radius - 80)
		    .cornerRadius(that.cornerRadius);

		this.labelArc = d3.svg.arc()
		    .outerRadius(that.radius - 40)
		    .innerRadius(that.radius - 40);

		that._drawSvg();
		that._drawPieChart();
	}

	 /**
     * 
     * get chart name
     * @public
     */
	this.getChartName = function(){
		return that.name;
	}

	this.changeTooltip = function(html){
		console.log(html);
		that.tooltip.html(html);
	}

	/**
	*
	*for unification purpose
	*@public
	*/
	this.draw = function(){
		that.drawPieChart();
	}

	this.animate = function(name){
		that.animatePieChart(name);
	}
//******************************************************************************
// Internal functions
//******************************************************************************

    /**
     * 
     * get the data from d3.tsv and make it suitable for pie chart visualization
     * @private
     */
	this._dataPreprocess = function(){

		//store the types of data according to a particular attribute
		that.rawData.forEach(function(d,i){
			if(that.precessedData[d[that.column]]==undefined){
				that.precessedData[d[that.column]] = {};
				that.precessedData[d[that.column]]["objs"] = [];
				that.pieChartTitle.push(d[that.column]);
			}

			that.precessedData[d[that.column]]["objs"].push(d);

		});


		that.numOfTitle = that.pieChartTitle.length;

		if(this.hasCatergories){

			that.pieChartTitle.forEach(function(type){
				that.precessedData[type]["objs"].forEach(function(d,i){
					that._createPieData(d);//count the number of instance of a particular type 
				});
			});
			

			that.pieChartTitle.forEach(function(name){
				var total_num = 0;
				if(that.hasCatergories){

					that.catergories.type.forEach(function(type){
						if(that.precessedData[name]["inf"]==undefined){
							that.precessedData[name]["inf"] = [];
						}
						var value = that.precessedData[name][type]?that.precessedData[name][type]:0;
						that.precessedData[name]["inf"].push({"cause":type,"value":value});
						total_num += value;
					});

					that.precessedData[name]["inf"].forEach(function(d){
						if(d.value==undefined)
							d.value = 0;
					});

					that.precessedData[name]["inf"].forEach(function(d){

						d.percentage = Math.round(1000 * d.value / total_num)/10;
						
					});
				}
			});
		}else{
			that.precessedData["inf"] = [];
			that.pieChartTitle.forEach(function(name){
				that.precessedData["inf"].push({"name":name,"value":that.precessedData[name]["objs"].length});
				//that.tooltip.total += that.precessedData[name]["objs"].length;
			});
		}
	}

    /**
     * create the data for pie visualization
     * @param an object containing the information about an instance of a specie
     * @private
     */
	this._createPieData = function(row){
		if(this.hasCatergories){
/*		 	var value = parseFloat(row[that.catergories["property"]]);
		 
			that.catergories.level.forEach(function(catergoriesLevel,i){

			 	if(that.precessedData[row[that.column]][catergoriesLevel]==undefined)
			 		that.precessedData[row[that.column]][catergoriesLevel] = 0;

			 	if(i == 0){
			 		//count the number of instance that sepalWidth is lower than 2.5
			 		if(value <= parseFloat(catergoriesLevel.substring(2))){		
			 			that.precessedData[row[that.column]][catergoriesLevel] += 1;
			 		}
			 	}else if(i == that.catergories.level.length-1){
			 		//count the number of instance that sepalWidth is higher than 4
			 		if(value > parseFloat(catergoriesLevel.substring(1))){	
			 			that.precessedData[row[that.column]][catergoriesLevel] += 1;
			 		}
			 	}else{
			 		//count the number inbetween 
			 		if((parseFloat(catergoriesLevel.split("-")[0])<value)&&
			 			(value <= parseFloat(catergoriesLevel.split("-")[1]))){
			 			
			 			that.precessedData[row[that.column]][catergoriesLevel] += 1;
			 		}
			 	}

			});*/
			var category = row[that.catergories["property"]];
			if(that.precessedData[row[that.column]][category]==undefined)
			{
				that.precessedData[row[that.column]][category] = 1;
			}else{
				that.precessedData[row[that.column]][category] += 1;
			}


		}

	}


    /**
     * 
     * Creates the basic SVG elements needed to draw the pie chart
     * @private
     */
	this._drawSvg = function(){
    	that.svg = that.subContainerDiv.append("svg")
    		.attr("width", that.canvas.width)     
            .attr("height",that.canvas.height)
            .append("g")
    		.attr("transform", "translate(" + that.canvas.width / 2 + "," + that.canvas.height / 2 + ")");
	}

    /**
     * 
     * draw the pie chart
     * @private
     */
	this._drawPieChart = function(){

		//draw the title on pie chart
		if(that.hasCatergories){
			that.title = that.subContainerTitle.append("text")
				.attr("class","title_pie")
				.text(that.name) 
				.attr("text-anchor", "center");
		}

		var g = that.svg.selectAll(".arc")
		      		.data(that.pie(this.hasCatergories?that.precessedData[that.name].inf:that.precessedData.inf))
		    	 .enter().append("g")
		      		.attr("class", "arc");

		that.path = g.append("path")
		    .attr("d", that.arc)
		    .attr("id", "arc")
		    .style("fill", function(d,i) {return that.color(i); })
		    .each(function(d) { this._current = d; })//store the initial angles
		    .on("mouseover", that._onMouseOver)
          	.on("mouseout", that._onMouseOut);

/*        that.path.on('mousemove', function(d) {
			  that.tooltip.style('top', (d3.event.layerY+10) + 'px')
			    .style('left', (d3.event.layerX+10) + 'px');
			});
*/
		that.label = g.append("text")
		  .attr("class","label_pie")
	      .attr("transform", function(d) { return "translate(" + that.labelArc.centroid(d) + ")"; })
	      .attr("dy", ".35em")
	      .text(function(d) {
	      	
	      	if(d.data.value>0&&that._isLarge(d)) {
	      		return d.data.percentage+"%";} })
	      .each(function(d) { this._current = d; });//store the initial label position

/*
		that.tooltip.append('label')                        
		  .attr('class', 'pie_label');                   

		that.tooltip.append('label')                        
		  .attr('class', 'pie_count');         

		that.tooltip.append('label')                        
		  .attr('class', 'pie_percentage');   */


		var legend = that.svg.selectAll('.legend')
		  .data(that.catergories.type)
		  .enter()
		  .append('g')
		  .attr('class', 'legend')
		  .attr('transform', function(d, i) {
		    var height = that.legendRectSize + that.legendSpacing;
		    var offset =  height * that.catergories.type.length / 2;
		    var horz = -2 * that.legendRectSize;
		    var vert = i * height - offset;
		    return 'translate(' + horz + ',' + vert + ')';
		  });    

		legend.append('text')
			  .attr('x', that.legendRectSize + that.legendSpacing)
			  .attr('y', that.legendRectSize - that.legendSpacing)
			  .text(function(d) { return d; });

		legend.append('rect')
			  .attr('width', that.legendRectSize)
			  .attr('height', that.legendRectSize)
			  .style('fill', function(d,i){return that.color(i)})
			  .style('stroke', function(d,i){return that.color(i)});
	}

    /**
     * 
     * change the pie chart from one to another
     * @private
     */
	this._change =  function (name) {

		//that.title.text(name);
		that.name = name;
	    that.path = that.path.data(that.pie(that.precessedData[name].inf)); // compute the new angles
	    that.path.transition().duration(500).ease("linear").attrTween("d", arcTween); // redraw the arcs
	    

	    that.label = that.label.data(that.pie(that.precessedData[name].inf))
	    	.text(function(d) {if(d.data.value>0&&that._isLarge(d)) return d.data.percentage + "%"; });
	    that.label.transition().duration(500).ease("linear").attrTween("transform",labelTween);

		that.title.text(that.name);

		that._setTooltip(that.name);
		// Store the displayed angles in _current.
		// Then, interpolate from _current to the new angles.
		// During the transition, _current is updated in-place by d3.interpolate.
		function arcTween(a) {
			  var i = d3.interpolate(this._current, a);
			  this._current = i(0);
			  return function(t) {
			    return that.arc(i(t));
			  };
		}

		// Store the displayed label in _current.
		// Then, interpolate from _current to the new label position.
		// During the transition, _current is updated in-place by d3.interpolate.
		function labelTween(l) {
		   var i = d3.interpolate(this._current, l);
		   this._current = i(0);
		   return function(t){
		   	return "translate(" + that.labelArc.centroid(i(t)) + ")";
		   }

		}
	}


	this._onMouseOver = function(d,i) {
		$(this).attr("class","onHover_pieChart");
		that.tooltip.select('.pie_label').html(d.data.cause);
		that.tooltip.select('.pie_count').html(d.data.value); 
		that.tooltip.select('.pie_percentage').html(d.data.percentage+"%");
		that.tooltip.style('display', 'block');

	}

	this._onMouseOut = function(){
		$(this).attr("class","");
		//that.tooltip.style('display', 'none');
	}


	this._isLarge = function(d){
		var angle = d.endAngle - d.startAngle;
		return (angle>Math.PI/8)?true:false;
	}

	this._setTooltip = function(stationName){
		var station = that.precessedData[stationName]["inf"][7];//human error
		that.tooltip.select('.pie_label').html(station.cause);
		that.tooltip.select('.pie_count').html(station.value); 
		that.tooltip.select('.pie_percentage').html(station.percentage+"%");
		that.tooltip.select('.pie_totalCost').html("$"+station.value * 100 +"K");
		that.tooltip.select('.pie_stationName').html(that.name);
		that.tooltip.style('display', 'block');

	}

}