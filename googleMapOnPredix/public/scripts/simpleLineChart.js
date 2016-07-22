
var simpleLineChart = function(container,data,stationName, setting){


  this.container = d3.select(container);
  this.data = data;

  that = this;
  this.svg;

  this.stationsData = {};
  this.stationsSummary = [];
  this.dataSet = [];

  this.width = setting.width;
  this.height = setting.height;
  
  this.stationName = stationName;

  this.timeRange = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  this.path;
  this.line;

  var parseDate = d3.time.format("%b").parse;


/*  this.timeRange = [0,1,2,3,4,5,6,7,8,9,10,11];*/
  this.drawLineChart = function(){
    that.dataProcess(that.data);
    that.drawSvg();
    that.drawLine(that.stationName);
  }

  this.dataProcess = function(data){
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

  this.drawSvg = function(){
      var margin = {top: 20, right: 20, bottom: 30, left: 50};
      that.width = that.width - margin.left - margin.right;
      that.height = that.height - margin.top - margin.bottom;


      that.svg = that.container.append("svg")
        .attr("width", that.width + margin.left + margin.right)
        .attr("height", that.height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }


  this.drawLine = function(data){
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
          .tickFormat(d3.time.format("%B"));

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      that.line = d3.svg.line()
        .x(function(d) { console.log(d);return x(d.time); })
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
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Number of customer affected");


      that.path = that.svg.append("path")
          .datum(that.dataSet[data])
          .attr("class", "line")
          .attr("d", that.line);
  }

  this.animateLineChart = function(stationName){
      that.path.datum(that.dataSet[stationName])
                    .transition().duration(500).ease("linear")
                    .attr("d",  that.line);

  }


}