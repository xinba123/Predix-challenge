	// Topojson method use to parse topojson file
	L.TopoJSON = L.GeoJSON.extend({
	    addData: function(jsonData) {
	      if (jsonData.type === "Topology") {
	        for (key in jsonData.objects) {
	          geojson = topojson.feature(jsonData, jsonData.objects[key]);
	          L.GeoJSON.prototype.addData.call(this, geojson);
	        }
	      }
	      else {
	        L.GeoJSON.prototype.addData.call(this, jsonData);
	      }
	    }
  	});
	
	// init map and add google map as layer
	var map = L.map('map').setView([-37.8131869,144.9629796], 8);
    map.scrollWheelZoom.enable(); 
    map.doubleClickZoom.enable();
    new L.Control.Zoom({position: 'bottomright'}).addTo(map);
    var googleRoadMap = new L.Google('ROADMAP');
    map.addLayer(googleRoadMap);

    // selected LGA colors, lga1 and lga2 color
    var selectedLGAColors = ["#7cb5ec","#868686","#ff0000"];
    var selectedLGAButtonIndex = 1;

    //add markers(the location of each substation)

    

    

    // init the lga layer and add to layer
    var lgaVicLayer = new L.TopoJSON();
    $.getJSON('resources/data/lga_victoria.topo.json').done(lgaVicData); 
    
    var locationsArray = [];
    locationsArray.push({lat:-37.8427282,lng:147.5631855});
    locationsArray.push({lat:-36.806028 ,lng:147.2255771});
    locationsArray.push({lat:-36.7383584,lng:147.1584559});
    locationsArray.push({lat:-38.063061,lng:142.6657159});
    locationsArray.push({lat:-38.3965819,lng:144.1909678});
    locationsArray.push({lat:-37.3271541,lng:145.8583385});
    locationsArray.push({lat:-38.1696948,lng:146.328107});
    locationsArray.push({lat:-38.2719211,lng:146.3918838});
    locationsArray.push({lat:-38.2552009,lng:146.6116729});
    locationsArray.push({lat:-37.8272504,lng:144.9461886});

    addMarkers(locationsArray,map);

    function addMarkers(locationsArray,map) {
/*        var myLatLngArray = [];
        d3.tsv("resources/data/Outage_data.tsv", function(error, data) {
            data.forEach(function(d,i){
                myLatLngArray.push({lat: Number(d.Latitude), lng: Number(d.Longitude)});
            });

            myLatLngArray.forEach(function(d,i){
                if(i < 100){
                    L.marker([d.lat, d.lng]).addTo(map);
                    console.log("working...");
                }
            });
        });*/

        locationsArray.forEach(function(d,i){
              L.marker([d.lat, d.lng]).addTo(map);          
        });

    }





    // method to add topojson data 
    // and add to map 
    // and add handle layer event
    function lgaVicData(topoData){
        lgaVicLayer.addData(topoData);
        lgaVicLayer.addTo(map);
        lgaVicLayer.eachLayer(handleLgaVicLayer);
        
        $(".leaflet-control-attribution").hide();
        $(".leaflet-control-zoom").css("margin-bottom","40px;");
        //$("path[stroke-dasharray='mouseover']").attr("fill","#ffffff").attr("stroke-opacity","0.5").attr("stroke-width","1")
        $( "path[fill='#ffffff']" ).attr("title", function() {return $(this).attr("stroke-dasharray");}); 
    }
    
    $("#lga-map-tooltip").hide();
    
 	// handle lga layer event
    function handleLgaVicLayer(layer){
    	layer.setStyle({
            fillColor : '#ffffff',
            fillOpacity: 0,
            color:'#555',
            weight:1,
            opacity:.5,
            className: 'leaflet-clickable masterTooltip',
            dashArray: layer.feature.properties.gaz_lga.replace("SHIRE", "").replace("CITY", "").replace("RURAL", "").trim()
          });
    	layer.on({
    		mouseover : mouseoverLga,
            mouseout: mouseoutLga,
            mousemove: mousemoveLga,
            click : selectLGA
          });
    }
 	
    function mouseoverLga(e){
        this.bringToFront();
        var x = e.originalEvent.layerX + 30;
        var y = e.originalEvent.layerY - 390;
        $("#lga-map-tooltip").attr("style","margin-top:"+y+"px;margin-left:"+x+"px;z-index:1000;");
        
        var lgaName = this.feature.properties.gaz_lga.replace("SHIRE", "").replace("CITY", "").replace("RURAL", "").trim();
        $("#lga-map-tooltip").show();
        $("#lga-map-tooltip").html("<strong style='font-size:1.2em;'>"+lgaName+"</strong><br>"+
                "<span style='font-size:0.8em;'>click to show details</span>");
        
        if(jQuery.inArray( this._path.attributes[6].value, selectedLGAColors ) >= 0){
            return;
        }
        this.setStyle({
            fillColor:selectedLGAColors[selectedLGAButtonIndex-1],
            fillOpacity: 0.4,
            weight:2,
            opacity: 1,
            dashArray: "mouseover"
        }); 
    }
    
    function mouseoutLga(){
        this.bringToFront();
        $("path[stroke-dasharray='mouseover']").attr("fill","#ffffff").attr("fill-opacity","0").attr("stroke-opacity","0.5").attr("stroke-width","1")
        .attr("stroke-dasharray"," ");
        
        $("#lga-map-tooltip").hide();
    }
    
    function mousemoveLga(e){
        this.bringToFront();
        var x = e.originalEvent.layerX + 30;
        var y = e.originalEvent.layerY - 390;
        $("#lga-map-tooltip").attr("style","margin-top:"+y+"px;margin-left:"+x+"px;z-index:1000;");
    }

    function selectLGA(){
        this.bringToFront();
        var selectedLGA = this.feature.properties.gaz_lga;
        
        if(selectedLGAButtonIndex == 1){
            if(selectedLGAColors[1] == this._path.attributes[6].value){
                return;
            }
            $( "path[fill='"+selectedLGAColors[0]+"']" ).attr("fill","#ffffff").attr("stroke-opacity","0.5").attr("stroke-width","1");
            this.setStyle({
                fillColor:selectedLGAColors[0],
                fillOpacity: 0.4,
                weight:2,
                opacity: 1,
                dashArray: " "
            });
            
            getSelectedLGAData(selectedLGA, selectedLGAButtonIndex);
            
        }else if(selectedLGAButtonIndex == 2){
            if(selectedLGAColors[0] == this._path.attributes[6].value){
                return;
            }
            $( "path[fill='"+selectedLGAColors[1]+"']" ).attr("fill","#ffffff").attr("stroke-opacity","0.5").attr("stroke-width","1");
            this.setStyle({
                fillColor:selectedLGAColors[1],
                fillOpacity: 0.4,
                weight:2,
                opacity: 1,
                dashArray: " "
            });
            
            getSelectedLGAData(selectedLGA, selectedLGAButtonIndex);
            
        }
    }