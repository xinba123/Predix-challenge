


var pieChartViewer = function(containerDiv, canvas, data, column, name, catergories) {
    "use strict";

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Constants
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 	this.canvas = canvas || { width:500, height:500};
    
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
    this.tooltip = this.containerDiv.append('div').attr('class', 'pietooltip');

    this.tooltip.total = 0;

    this.name = name || {};
    this.catergories = catergories || {};

    this.hasCatergories = !jQuery.isEmptyObject(that.catergories);

    
    this.precessedData = {};//store the preprocessed data 
    this.pieChartTitle = [];//the title shown on pie chart
    this.numOfTitle = 0;

	this.arc = d3.svg.arc()
	    .outerRadius(this.radius - 10);


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
     * pie chart animation. Display different Pie
     * @private
     */
 	this.animatePieChart = function(name) {

		that._change(name);
        
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
				if(that.catergories!={}){
					that.catergories.type.forEach(function(type){
						if(that.precessedData[name]["inf"]==undefined)
							that.precessedData[name]["inf"] = [];
						that.precessedData[name]["inf"].push({"cause":type,"value":that.precessedData[name][type]});
					});
				}
			});
		}else{
			that.precessedData["inf"] = [];
			that.pieChartTitle.forEach(function(name){
				that.precessedData["inf"].push({"name":name,"value":that.precessedData[name]["objs"].length});
				that.tooltip.total += that.precessedData[name]["objs"].length;
			});
		}

		that.pieChartTitle.forEach(function(name){
			that.precessedData[name]["inf"].forEach(function(d){
				if(d.value==undefined)
					d.value = 0;
			});
		})
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

		var g = that.svg.selectAll(".arc")
		      		.data(that.pie(this.hasCatergories?that.precessedData[that.name].inf:that.precessedData.inf))
		    	 .enter().append("g")
		      		.attr("class", "arc");

		//draw the title on pie chart
/*		if(that.hasCatergories){
			that.title = that.svg.append("text")
				.text(that.name) 
				.attr("text-anchor", "middle")
	            .attr("dominant-baseline", "central")
	            .attr('style', "font-size: 10em;");
		}*/

		that.path = g.append("path")
		    .attr("d", that.arc)
		    .attr("id", "arc")
		    .style("fill", function(d,i) {return that.color(i); })
		    .each(function(d) { this._current = d; })//store the initial angles
		    .on("mouseover", that._onMouseOver)
          	.on("mouseout", that._onMouseOut);

		that.label = g.append("text")
	      .attr("transform", function(d) { return "translate(" + that.labelArc.centroid(d) + ")"; })
	      .attr("dy", ".35em")
	      .text(function(d) {if(d.data.value>0) {
	      	return d.data.level;} })
	      .each(function(d) { this._current = d; });//store the initial label position


		that.tooltip.append('div')                        
		  .attr('class', 'pie_label');                   

		that.tooltip.append('div')                        
		  .attr('class', 'pie_count');         

		that.tooltip.append('div')                        
		  .attr('class', 'pie_percent');                 
	}

    /**
     * 
     * change the pie chart from one to another
     * @private
     */
	this._change =  function (name) {

		//that.title.text(name);

	    that.path = that.path.data(that.pie(that.precessedData[name].inf)); // compute the new angles
	    that.path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs

/*	    that.label.data(that.pie(that.precessedData[name].inf))
	    	.text(function(d) {if(d.data.value>0) return d.data.level; });
	    that.label.transition().duration(750).attrTween("transform",labelTween);
*/
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
		console.log(d);
		var percent = Math.round(1000 * d.data.value / that.tooltip.total) / 10;
		that.tooltip.select('.pie_label').html(d.data.cause);
		that.tooltip.select('.pie_count').html(d.data.value); 
		//that.tooltip.select('.pie_percent').html(percent + '%'); 
		that.tooltip.style('display', 'block');

	}

	this._onMouseOut = function(){
		$(this).attr("class","");
		that.tooltip.style('display', 'none');
	}
}
