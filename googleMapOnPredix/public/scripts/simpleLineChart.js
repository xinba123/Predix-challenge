
var simpleLineChart = function(container,data,stationName,setting,aspect){

  'use strict';

  this.container = d3.select(container);
  this.titleContainer = this.container.append("div");
  this.data = data;

  
  this.svg;

  this.stationsData = {};
  this.stationsSummary = [];
  this.dataSet = [];

  this.setting = setting || [];

  this.aspect = aspect;
  this.width = this.setting.width || this.container.node().getBoundingClientRect().width;
  this.height = this.setting.height || this.width/this.aspect;
  

  this.stationName = stationName;

  this.timeRange = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  this.path;
  this.line;
  this.shadow;
  this.area;

  var parseDate = d3.time.format("%b").parse;
  var that = this;

  this.onSizeChange = function(){
    
      var targetWidth = that.container.node().getBoundingClientRect().width;
      that.container.attr("width", targetWidth);
      that.container.attr("height", targetWidth / that.aspect);
      that.width = targetWidth;
      that.height =  targetWidth / that.aspect;

      that.container.select("svg").remove();
      that._drawSvg();
      that._drawTitle(that.stationName);
      that._drawLine(that.stationName);
  }

  this.draw = function(){
    that.drawLineChart();
  }

  this.animate = function(name){
    that.animateLineChart(name);
  }

/*  this.timeRange = [0,1,2,3,4,5,6,7,8,9,10,11];*/
  this.drawLineChart = function(){
    that._dataProcess(that.data);    
    that._drawSvg();
    that._drawTitle(that.stationName);
    that._drawLine(that.stationName);
  }

  this.animateLineChart = function(stationName){
      that.stationName = stationName;

      that.path.datum(that.dataSet[stationName])
                    .transition().duration(500).ease("linear")
                    .attr("d",  that.line);

      that._drawTitle(that.stationName);

      that.shadow.datum(that.dataSet[stationName])
        .transition().duration(500).ease("linear")
        .attr("d", that.area);
  }

  this._dataProcess = function(data){
    data.forEach(function(d,i){
      if(that.stationsData[d.name]==undefined)
      {
        that.stationsData[d.name] = [];
        that.stationsData[d.name].push({"time":d.month,"numOfCustomerAffected":d.numOfCustomerAffected});
      }else{
        that.stationsData[d.name].push({"time":d.month,"numOfCustomerAffected":d.numOfCustomerAffected});
      }        
    });


    for(var name in that.stationsData){
        
      if(that.stationsSummary[name]==undefined)
            that.stationsSummary[name]= [];

        that.timeRange.forEach(function(d){
          that.stationsSummary[name][d]=0;
        });

        that.stationsData[name].forEach(function(instance,i){

              that.stationsSummary[name][instance.time]+=instance.numOfCustomerAffected;
        });
    }

    for(var name in that.stationsData){
        that.dataSet[name] = [];
        for(var time in that.stationsSummary[name]){
          that.dataSet[name].push({"time":parseDate(time),"numOfCustomerAffected":that.stationsSummary[name][time]})
        }

    }

  }



  this._drawSvg = function(){
      var margin = {top: 20, right: 20, bottom: 30, left: 50};
      that.width = that.width - margin.left - margin.right;
      that.height = that.height - margin.top - margin.bottom;


      that.svg = that.container.append("svg")
        .attr("width", that.width + margin.left + margin.right)
        .attr("height", that.height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }

  this._drawTitle = function(){
    this.titleContainer.attr("class","title_lineChart")
      .text(that.stationName);
  }

  this._drawLine = function(data){
      var x = d3.time.scale()
        .domain([new Date(2012, 0, 1), new Date(2012, 11, 31)])
        .range([0, that.width]);


      var y = d3.scale.linear()
          .range([that.height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .ticks(d3.time.months)
          .tickSize(16, 0)
          .tickFormat(d3.time.format("%b"));
          
      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      that.area = d3.svg.area()
          .x(function(d) { return x(d.time); })
          .y0(that.height)
          .y1(function(d) { return y(d.numOfCustomerAffected); });

      that.line = d3.svg.line()
        .x(function(d) { return x(d.time); })
        .y(function(d) { return y(d.numOfCustomerAffected); });


      x.domain(d3.extent(that.dataSet[data], function(d) { return d.time; }));
      y.domain([0,100]);

      that.svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + that.height + ")")
          .call(xAxis);

      that.svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          //.attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "start")
          .text("Number of customer affected");

      that.svg.append("g")         
        .attr("class", "grid")
        .attr("transform", "translate(0," + that.height + ")")
        .call(make_x_axis()
            .tickSize(-that.height, 0, 0)
            .tickFormat("")
            );

      that.svg.append("g")         
          .attr("class", "grid")
          .call(make_y_axis()
              .tickSize(-that.width, 0, 0)
              .tickFormat("")
              );


      that.shadow = that.svg.append("path")
        .datum(that.dataSet[data])
        .attr("class", "area")
        .attr("d", that.area);

      that.path = that.svg.append("path")
          .datum(that.dataSet[data])
          .attr("class", "line")
          .attr("d", that.line);


      function make_x_axis() {        
        return d3.svg.axis()
            .scale(x)
             .orient("bottom")
             .ticks(12)
      }

      function make_y_axis() {        
          return d3.svg.axis()
              .scale(y)
              .orient("left")
              .ticks(20)
      }
  }

}