var TABViewer = function(containerDiv, userSettings, data, tableName, color_objects) {
    "use strict";


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Constants
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //table positioning and size in SVG canvas
    this.canvas = {
        resize: {
            minColumns: 20,             //How many columns should there be in the grid to do a resize?
            cellWidthFactor: 12         //How quickly the grid cell size will reduce, depending on the number of items. Lower number == quicker reducing
        },

        max_cell_width: 50              //the maximun width for a cell
    };


    this.row_objects = [];
    this.column_objects = [];
    this.color_objects = color_objects || [];
    this.colorFunction = (userSettings && userSettings.colorFunction) || function() { return "#AAA"; };
    this.datasets = [];



    var that = this;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Properties
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    this.domContainerDiv = containerDiv;
    this.containerDiv = d3.select(containerDiv);    //User-provided DOM element that contains the DigViewer interface
    this.subContainerDiv = this.containerDiv.append("div");     //To remove all content without removing the main DIV

    var x;
    var y;
    this.matrixWidth = 0;
    this.matrixHeight = 0;

    this.numOfRows = 0;

    this.cell = {//default value
            width: 26, 
            height: 26
        };

    this.reductionFactor = 0;
    this.gridFontSize = 1;      //default font size in em

    this.datasets = data || [];
    this.tableName = tableName || "";

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Methods
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    /**
     * Renders table on containing DIV.
     * @param {Object} data to be displayed as cells in the table
     * @param {Array} row_objects
     * @param {Array} column_objects
     * @param {Array} color_objects
     */
    this.drawTable = function(tableName) {

        that.datasets = that._dataPreProcess(that.datasets,tableName);

        //If there's no datasets, just show a text that says so
        if (that.datasets.length === 0) {
            that._drawEmptyDatasetMessage();
            that.onGridLoaded();
            return;
        }

        //***************************************************************************************
        // Define the basic parameters and functions for the table, depeding on number of elements
        //***************************************************************************************
        //Make table smaller if there's too many elements adjust font size accordingly
        that.widthReductionFactor = 0;
        var tableFontSizeScale = d3.scale.linear();
        tableFontSizeScale.domain([0,30]);
        tableFontSizeScale.range([1,0.6]);

        // get the length of longest lable and set it as width
        that.cell.width = this._getMaxWidth(); 

        //Determine size of the data table
        that.matrixWidth = that.cell.width * that.column_objects.length;
        that.matrixHeight = that.cell.height * that.datasets.length;

        //***************************************************************************************
        // Define rows and columns sorting using provided functions
        //***************************************************************************************
        //Columns
        x = d3.scale.ordinal()
            .rangeBands([0, that.matrixWidth])
            .domain(d3.range(0,that.column_objects.length));

        //Rows
        y = d3.scale.ordinal()
            .rangeBands([0, that.matrixHeight])
            .domain(d3.range(0,that.datasets.length));
            

        //****************************************
        // Visualization part
        //****************************************
        //Remove previously drawn elements from the container DIV
        that.subContainerDiv.remove();
        that.subContainerDiv = that.containerDiv.append("div");

        that._drawSvg();
        that._drawHeader();
        that._drawRows();
        that._drawColumns();
    }
//******************************************************************************
// Internal functions
//******************************************************************************



    /**
     * data transformation
     * @param data
     * @returns {{}}
     * @private
     */
    this._dataPreProcess = function(data,tableName) {
        var newData = [];

        //add index values to dataset
        data.forEach(function(d,i){
            newData.push({"index":i,"obj":d});
        });

        //get the column name from the first obj
        var col_name = Object.keys(data[0]);

        console.log(col_name);

        //create an array of column objs
        col_name.forEach(function(d,i){
            var col_obj = {"id":i,"name":d,"order":"asc"};
            that.column_objects.push(col_obj);
        });
        return newData;
    };



     /**
     * extract values from data object
     * @param data
     * @returns {{}}
     * @private
     */
    this._extractValue = function(data) {
        var newData = [];

        for(var name in data["obj"]){
            newData.push(data["obj"][name]);
        }
        return newData;
    };

    /**
     * Creates the basic SVG elements needed to draw the table.
     * @private
     */
    this._drawSvg = function() {
        that.svg = that.subContainerDiv.append("svg")
            .attr("width", that.matrixWidth)     
            .attr("height",that.matrixHeight);

        //move the table(only include the data) below the table header  
        that.table = that.svg.append("g")
            .attr("transform", "translate(0," + that.cell.height + ")");   

        //Main table background rectangle
        var tableBackground = that.table.append("rect")
            .attr("class", "background cell_border")
            .attr("id", "tableBackground")
            .attr("width", that.matrixWidth)
            .attr("height", that.matrixHeight)
            .attr("pointer-events", "none");

        //table header
        that.tableHeader = that.svg.append("g")
            .attr("width", that.matrixWidth)
            .attr("height", that.cell.height)
            .attr("class", "background cell_border header-fixed-top")
            .attr("id", "tableHeader");
    };

     /**
     * Draws a table header.
     * @private
     */
    this._drawHeader = function() {

        var tableHeaderRect = that.tableHeader.append("rect")
            .attr("width", that.matrixWidth)
            .attr("height", that.cell.height);
        
        var tableHeaderColumn = that.tableHeader.selectAll(".column")
            .data(that.column_objects)
            .enter().append("g")
            //.attr("class", function(p, q) {var clazz = that.column_label_class_function(p, q); clazz += " column"; return clazz;})
            .attr("transform", function(d,i) {return "translate(" + x(i) + ")rotate(-90)"; });

        tableHeaderColumn.append("line")
            .attr("x1", -(that.cell.height))
            .attr("pointer-events", "none");

        var tableHeaderContent = that.tableHeader.selectAll(".cell")
            .data(that.column_objects)
            .enter().append("svg")
            .attr("class", "cell")
            .attr("x", function(d) {
                return x(d.id);
            })
            .on('click', function(d,i){
                that._onRowSort(d);
            });

        tableHeaderContent.append("text").text(function(d) {return d.name;})
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr('style', "font-size: " + (that.gridFontSize * 0.8) + "em;")
            .attr("x", x.rangeBand()/2)
            .attr("y", y.rangeBand()/2)
            .attr('fill', 'black');
    }

    /**
     * Draws a table row.
     * @private
     */
    this._drawRows = function() {
        var row = that.table.selectAll(".row")
            .data(that.datasets)
            .enter().append("g")
            .attr("class", function (p, q) {
                var clazz = "row";
                return clazz;
            })
            .attr("transform", function (d,i) {
                return "translate(0," + y(i) + ")";

            })
            .each(that._drawCells);

        //Horizontal white line between each row
        row.append("line")
            .attr("class", "cell_border")
            .attr("x2", that.matrixWidth)
            .attr("pointer-events", "none");
    };


    /**
     * Draws table columns
     * @private
     */
    this._drawColumns = function() {
        var column = that.table.selectAll(".column")
            .data(that.column_objects)
            .enter().append("g")
            //.attr("class", function(p, q) {var clazz = that.column_label_class_function(p, q); clazz += " column"; return clazz;})
            .attr("transform", function(d,i) {return "translate(" + x(i) + ")rotate(-90)"; });

        //Vertical white line between columns
        column.append("line")
            .attr("class", "cell_border")
            .attr("x1", -(that.matrixHeight))
            .attr("pointer-events", "none");

    };


    /**
     * Draw cells for a table row.
     * @param row
     * @private
     */
    this._drawCells = function(row) {
        var cellContainer = d3.select(this).selectAll(".cell")
            .data(that._extractValue(row))
            .enter()
            .append("svg")
            .attr("class", "cell")
            .attr("x", function(d,i) {
                return x(i);
            })
            .on("mouseover", that._onCellMouseOver)
            .on("mouseout", that._onCellMouseOut)
            .on("mousedown",that._onCellMouseDown)
            .on("mouseup",that._clearGridMouseDown);
          
        
          
        //Text for a cell, displaying the number of datasets available
        cellContainer.append("text")
            .text(function(d) {
                    return d;
            })
            .attr("x", function() { return (x.rangeBand()/2); })
            .attr('y', (y.rangeBand()/2))       //Cell text height vertival align
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr("width", x.rangeBand())
            .attr("height", y.rangeBand())
            .attr('style', "font-size: " + (that.gridFontSize * 0.8) + "em;")
            .attr('fill', 'black');
    };


    /**
     * Replace SVG table with message saying there's no datasets available.
     * @private
     */
    this._drawEmptyDatasetMessage = function() {
        //If anything was previously drawn
        that.subContainerDiv.remove();
        that.subContainerDiv = that.containerDiv.append("div");
        that.subContainerDiv.attr("style", "display:flex; justify-content:center; width:100%; height:100%;");

        that.subContainerDiv
            .append("div").attr("id", "noDatasetsMessageDiv")
            .attr("style", "align-self: center; font-size: large;")
            .append("span").attr("id", "noDatasetsMessageSpan")
            .text("No datasets available for the current settings!");
    };

    /**
    *get the length of longest column lable for setting cell width
    *@private
    */
    this._getMaxWidth = function(){
        var max_letter = 0;
        for(var i = 0; i < that.column_objects.length ;i++){
                if(that.column_objects[i].name.length > max_letter){
                    max_letter = that.column_objects[i].name.length;
                }
        }
        var max_width = max_letter * 10;

        //if the width exceed the maximun cell width,just return the maximun width
        if(max_width > that.canvas.max_width)
        {
            return that.canvas.max_width;
        }

        return max_width;
    }

    /**
    *sort the rows and move it using d3 transition
    *@private
    */
    this._onRowSort = function(header){

        //romove the sort icon and get the DOM element for the selected header
        var selectedHeader = d3.select("#tableHeader").selectAll("svg").select("text")
            .text(function(d){return d.name})
            .filter(function(d, i) { return i == header.id; });

        //add the sort "icon" on the selected header
        selectedHeader.text(function(d){
                return d.order == "dsc" ? d.name+" ▾":d.name+" ▴";}
            );

        y.domain(that._sortRow(header).map(function(p){return p.index;}));

        var rows_to_move = that.svg.transition().duration(1000).selectAll(".row")
            .delay(function(d) { return that.datasets.indexOf(d.index) * 0.5; })
            .attr("transform", function(d) {  return "translate(0," + y(d.index) + ")"; });

           
    }

    /**
    *sort the rows based on the selected header
    *@private
    */
    this._sortRow =  function(d){
        var data = JSON.parse(JSON.stringify(that.datasets));
        if(d.order == "asc"){
            data.sort(function(p1,p2){
                var p1Val = p1["obj"][d["name"]];
                var p2Val = p2["obj"][d["name"]];
                return p1Val.localeCompare(p2Val);
            });
            d.order = "dsc";
        }
        else{
            data.sort(function(p1,p2){
                var p1Val = p1["obj"][d["name"]];
                var p2Val = p2["obj"][d["name"]];
                return -p1Val.localeCompare(p2Val);
            });
            d.order = "asc";
        }

        return data;
    }


};