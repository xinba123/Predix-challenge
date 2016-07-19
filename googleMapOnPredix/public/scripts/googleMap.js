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
   
    
    var mapArray = [];

    mapArray.push({name:"Altona Power Station",subsurb:"Laverton North",lat:-37.838848,lng:144.789381});
    mapArray.push({name:"Anglesea Power Station",subsurb:"Anglesea",lat:-38.38548,lng:144.183686});
    mapArray.push({name:"Ararat Power Station",subsurb:"Ararat",lat:-37.268728,lng:142.92417});
    mapArray.push({name:"Ballarat Power Station",subsurb:"Warrenheip",lat:-38.3542411,lng:145.0996057});
    mapArray.push({name:"Banimboola Power Station",subsurb:"Mitta Mitta River",lat:-37.3588934,lng:143.8368069});
    mapArray.push({name:"Basslink-Loy Yang Power Station",subsurb:"Loy Yang",lat:-38.262303,lng:146.608085});
    mapArray.push({name:"Bendigo Power Station",subsurb:"Golden Square",lat:-36.784024,lng:144.25359});
    mapArray.push({name:"Berwick Power Plant",subsurb:"Berwick",lat:-38.0322511,lng:145.33851});
    mapArray.push({name:"Bogong Power Station",subsurb:"Bogong",lat:-37.1800165,lng:146.4068933});
    mapArray.push({name:"Broadmeadows Power Station",subsurb:"Campbellfield",lat:-37.688697,lng:144.9593026});
    mapArray.push({name:"Brooklyn Power Station",subsurb:"Brooklyn",lat:-37.825967,lng:144.861786});
    mapArray.push({name:"Brunswick Power Station",subsurb:"Brunswick East",lat:-37.77267,lng:144.984334});
    mapArray.push({name:"Cape Bridgewater Wind Farm",subsurb:"Cape Bridgewater",lat:-38.372159,lng:141.379442});
    mapArray.push({name:"Cape Nelson North Wind Farm",subsurb:"Cape Nelson",lat:-38.365999,lng:141.547998});
    mapArray.push({name:"Cape Nelson South Wind Farm",subsurb:"Cape Nelson",lat:-38.412,lng:141.543});
    mapArray.push({name:"Challicum Hills Wind Farm",subsurb:"Buangor",lat:-37.359352,lng:143.152386});
    mapArray.push({name:"Clayton Power Station",subsurb:"Clayton",lat:-37.9080452,lng:145.0952506});
    mapArray.push({name:"Clover Power Station",subsurb:"Bogong",lat:-36.785784,lng:147.219446});
    mapArray.push({name:"Codrington Wind Farm",subsurb:"Codrington",lat:-38.6439407,lng:143.8287613});
    mapArray.push({name:"Cranbourne Power Station",subsurb:"Cranbourne",lat:-38.085635,lng:145.266432});
    mapArray.push({name:"Dartmouth Power Station",subsurb:"Dartmouth",lat:-37.1863239,lng:144.8341746});
    mapArray.push({name:"Dederang Power Station",subsurb:"Dederang",lat:-36.454287,lng:146.990813});
    mapArray.push({name:"East Rowville Power Station",subsurb:"Rowville",lat:-37.940959,lng:145.236341});
    mapArray.push({name:"Eildon Power Station",subsurb:"Eildon",lat:-37.223708,lng:145.92092});
    mapArray.push({name:"Fishermans Bend Power Station",subsurb:"Melbourne",lat:-37.825191,lng:144.929431});
    mapArray.push({name:"Fosterville Power Station",subsurb:"Axedale",lat:-36.738229,lng:144.510621});
    mapArray.push({name:"Geelong Power Station",subsurb:"Geelong",lat:-38.082624,lng:144.338498});
    mapArray.push({name:"Glenrowan Power Station",subsurb:"Winton",lat:-36.493503,lng:146.131973});
    mapArray.push({name:"Hazelwood Power Station",subsurb:"Hazelwood",lat:-38.281172,lng:146.428342});
    mapArray.push({name:"Heatherton Power Station",subsurb:"Heatherton",lat:-37.941128,lng:145.078232});
    mapArray.push({name:"Horsham Power Station",subsurb:"Horsham",lat:-36.722205,lng:142.247589});
    mapArray.push({name:"Heywood Power Station",subsurb:"Heywood",lat:-38.180773,lng:141.639092});
    mapArray.push({name:"Jeeralang Power Station",subsurb:"Jeeralang",lat:-38.276921,lng:146.424482});
    mapArray.push({name:"Keilor Power Station",subsurb:"Keilor",lat:-37.738239,lng:144.846177});
    mapArray.push({name:"Kerang Power Station",subsurb:"Kerang",lat:-35.771467,lng:143.933995});
    mapArray.push({name:"Snowy Hydro Laverton Power Station",subsurb:"Laverton",lat:-37.8329643,lng:144.7864833});
    mapArray.push({name:"Loy Yang A Power Station",subsurb:"Loy Yang",lat:-38.254875,lng:146.571266});
    mapArray.push({name:"Loy Yang B Power Station",subsurb:"Loy Yang",lat:-38.256497,lng:146.573862});
    mapArray.push({name:"Keilor Power Station",subsurb:"Keilor",lat:-37.738239,lng:144.846177});

    mapArray.push({name:"Macarthur Wind Farm", lat:-38.064804, lng:142.18436});
    mapArray.push({name:"Malvern", lat:-37.877829, lng:-37.877829});
    mapArray.push({name:"Mckay Creek Power Station", lat:-36.7853472, lng:147.2196667});
    mapArray.push({name:"Mildura Solar Farm", lat:-34.1899229, lng:142.1676801});
    mapArray.push({name:"Moorabool Power Station", lat:-38.037, lng:144.296809});
    mapArray.push({name:"Mortlake Power Station", lat:-38.062219, lng:142.670381});
    mapArray.push({name:"Mortons Lane Wind Farm", lat:-37.835157, lng:142.46628});
    mapArray.push({name:"Morwell Power Station", lat:-38.258828, lng:146.419898});
    mapArray.push({name:"Mount Beauty", lat:-36.743887, lng:147.165862});
    mapArray.push({name:"Newport Power Station", lat:-37.8438215, lng:144.8934531});
    mapArray.push({name:"Oakland Hills Wind Farm", lat:-37.681472, lng:142.55226});
    mapArray.push({name:"Point Henry", lat:-38.135029, lng:144.422283});
    mapArray.push({name:"Portland Aluminium", lat:-38.135029, lng:144.422283});
    mapArray.push({name:"Queen Victoria Market Solar Array", lat:-37.8062549, lng:144.9563326});
    mapArray.push({name:"Red Cliffs Power Station", lat:-34.291843, lng:142.239323});
    mapArray.push({name:"Richmond Power Station", lat:-37.831136, lng:145.001581});
    mapArray.push({name:"Ringwood Power Station", lat:-37.820834, lng:145.215577});
    mapArray.push({name:"Rowville Power Station", lat:-37.92928, lng:145.227283});
    mapArray.push({name:"Rubicon Power Station", lat:-37.3271498, lng:145.8583438});

    mapArray.push({name:"Shepparton Power Station",subsurb:"Shepparton",lat:-36.342813,lng:145.414578});
    mapArray.push({name:"Somerton Power Station",subsurb:"Somerton",lat:-37.622474,lng:144.948635});
    mapArray.push({name:"South Morang Power Station",subsurb:"Morang",lat:-37.644482,lng:145.078436});
    mapArray.push({name:"Springvale Power Station",subsurb:"Springvale",lat:-37.928182,lng:145.146101});
    mapArray.push({name:"Stawell Power Station",subsurb:"Stawell",lat:-37.058339,lng:142.752474});
    mapArray.push({name:"Sydenham Power Station",subsurb:"Sydenham",lat:-37.676163,lng:144.747213});
    mapArray.push({name:"Tarrone Power Station",subsurb:"Tarrone",lat:-38.17917,lng:142.181073});
    mapArray.push({name:"Templestowe Power Station",subsurb:"Templestowe",lat:-37.74807,lng:145.170536});
    mapArray.push({name:"Terang Power Station",subsurb:"Terang",lat:-38.232971,lng:142.932312});
    mapArray.push({name:"Thomastown Power Station",subsurb:"Thomastown",lat:-37.693699,lng:145.009929});
    mapArray.push({name:"Toora Wind Farm",subsurb:"Toora",lat:-38.6534396,lng:146.3380408});
    mapArray.push({name:"Tyabb Power Station",subsurb:"Tyabb",lat:-38.267861,lng:145.201553});
    mapArray.push({name:"Waubra Power Station",subsurb:"Waubra",lat:-37.355982,lng:143.605915});
    mapArray.push({name:"Wemen Power Station",subsurb:"Wemen",lat:-34.784857,lng:142.521461});
    mapArray.push({name:"West Melbourne Power Station",subsurb:"Melbourne",lat:-37.80034,lng:144.934854});
    mapArray.push({name:"Western Port Power Station",subsurb:"Hastings",lat:-38.281938,lng:145.208307});
    mapArray.push({name:"Wodonga Power Station",subsurb:"Baranduda",lat:-36.154815,lng:146.950149});
    mapArray.push({name:"Yallourn Power Station",subsurb:"Yallourn",lat:-38.174138,lng:146.349914});
    mapArray.push({name:"Yarrawonga Weir Power Station",subsurb:"Yarrawonga",lat:-36.0096134,lng:145.9971817});

    

    addMarkers(mapArray,map);

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
              L.marker([d.lat, d.lng],{
                title:d.name,
                id:i
              }).addTo(map).on('click', onClick);         
        });

    }

    function onClick(e){
        var name = mapArray[e.target.options.id].name;
        console.log(pieChart.precessedData[name]);
        var name = mapArray[e.target.options.id].name
        pieChart.animatePieChart(name);
    }

    $.getJSON('resources/data/lga_victoria.topo.json').done(OnfinloadingGeoData); 

    function OnfinloadingGeoData(topoData){
        lgaVicData(topoData);
        pieChart.drawPieChart();
        $(".loader").css("visibility","hidden");
        $("#map").attr("class","map leaflet-container leaflet-fade-anim");
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