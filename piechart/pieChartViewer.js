


var pieChartViewer = function(containerDiv, data, column, type, catergories) {
    "use strict";

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Constants
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	this.canvas = {
        width:1000,
        height:1000
    };
    
	this.color = d3.scale.category20();

	this.radius = Math.min(this.canvas.width, this.canvas.height) / 2;
    var that = this;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Properties
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	try{
    	this.domContainerDiv = containerDiv || function(){throw "container is not set."}();
    	this.rawData = data || function(){throw "data is not set."}();
    	this.column = column || function(){throw "column is not set."}();
	}catch(err){
		console.log(err);
	}

    this.containerDiv = d3.select(containerDiv);    //User-provided DOM element that contains the DigViewer interface
    this.subContainerDiv = this.containerDiv.append("div");     //To remove all content without removing the main DIV



    this.type = type || {};
    this.catergories = catergories || {};

    this.hasCatergories = !jQuery.isEmptyObject(that.catergories);

    
    this.precessedData = {};//store the preprocessed data 
    this.pieChartTitle = [];//the title shown on pie chart
    this.numOfTitle = 0;

	this.arc = d3.svg.arc()
	    .outerRadius(this.radius - 10)
	    .innerRadius(0);

	this.labelArc = d3.svg.arc()
	    .outerRadius(this.radius - 40)
	    .innerRadius(this.radius - 40);

	this.pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) {return d.value; });

	

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Methods
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     /**
     * 
     * draw pie chart
     * @private
     */
 	this.drawPieChart = function() {
 		that._dataPreprocess();

        //Remove previously drawn elements from the container DIV
        that.subContainerDiv.remove();
        that.subContainerDiv = that.containerDiv.append("div");

        that._drawSvg();
        that._drawPieChart();
 	}

    /**
     * 
     * pie chart animation. Display different pie charts for 5s each
     * @private
     */
 	this.animatePieChart = function() {

        var timer = {};
        var i = 0;
        d3.timer(function(_elapsed){
        	if (timer['starttime'] == undefined)
				timer['starttime'] = _elapsed;

        	if(_elapsed - timer['starttime'] >= 5000){

        		//change to another species after 5s
        		that._change(that.pieChartTitle[i++%that.numOfTitle]);
        		timer['starttime'] = _elapsed;
        	}
        });
        
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

			that.pieChartTitle.forEach(function(type){
				if(that.catergories!={}){
					that.catergories.level.forEach(function(level){
						if(that.precessedData[type]["inf"]==undefined)
							that.precessedData[type]["inf"] = [];
						that.precessedData[type]["inf"].push({"level":level,"value":that.precessedData[type][level]});
					});
				}
			});
		}else{
			//
			that.precessedData["inf"] = [];
			that.pieChartTitle.forEach(function(type){
				that.precessedData["inf"].push({"type":type,"value":that.precessedData[type]["objs"].length});
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
		 	var value = parseFloat(row[that.catergories["property"]]);
		 
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

			});
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

		var g = that.svg.selectAll(".arc")
		      		.data(that.pie(this.hasCatergories?that.precessedData[that.type].inf:that.precessedData.inf))
		    	 .enter().append("g")
		      		.attr("class", "arc");

		//draw the title on pie chart
		if(that.hasCatergories){
			that.title = that.svg.append("text")
				.text(that.type) 
				.attr("text-anchor", "middle")
	            .attr("dominant-baseline", "central")
	            .attr('style', "font-size: 10em;");
		}

		that.path = g.append("path")
		    .attr("d", that.arc)
		    .attr("id", "arc")
		    .style("fill", function(d,i) {return that.color(i); })
		    .each(function(d) { this._current = d; })//store the initial angles
		    .on("mouseover",that._onHoverPie);

		that.label = g.append("text")
	      .attr("transform", function(d) { return "translate(" + that.labelArc.centroid(d) + ")"; })
	      .attr("dy", ".35em")
	      .text(function(d) {if(d.data.value>0) {
	      	console.log(d)
	      	return d.data.level;} })
	      .each(function(d) { this._current = d; });//store the initial label position
	}

    /**
     * 
     * change the pie chart from one to another
     * @private
     */
	this._change =  function (type) {

		that.title.text(type);

	    that.path = that.path.data(that.pie(that.precessedData[type].inf)); // compute the new angles
	    that.path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs

	    that.label.data(that.pie(that.precessedData[type].inf))
	    	.text(function(d) {if(d.data.value>0) return d.data.level; });
	    that.label.transition().duration(750).attrTween("transform",labelTween);

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


	this._onHoverPie = function(d,i) {
		console.log(d.data);
	}


}