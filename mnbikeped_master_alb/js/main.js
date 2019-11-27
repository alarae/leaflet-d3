/* Minnesota Pedestrian and Bicycle Transportation Funding */


$(document).ready(createMap);

//add background image
var body = document.getElementsByTagName('context')[0];
body.style.backgroundImage = 'img/srts.jpg';

//declare global variables
var populationCitiesLayer
var SRTSFundedCitiesLayer
var SRTSUnfundedCitiesLayer
var STIPFundedCitiesLayer
var STIPUnfundedCitiesLayer
var TTLFundedCitiesLayer
var TTLUnfundedCitiesLayer
var DISTRICTLayer
var X = 0
//var citiesFundedLayer
//var citiesUnfundedLayer
var projectPtsLayer
var fundedPtsLayer
var unfundedPtsLayer
var distboundsLayer

//declare attributes from geojson
var attrArray = ["POP2000","SRTSFUNDED", "SRTSUNFUND", "STIPFUNDED", "STIPUNFUND", "TTLFUNDED", "TTLUNFUD"]; 

//Create the Leaflet map
function createMap(){
   
//specify initial view
    var map = L.map('map', {
        center: [45, -94],
        zoom: 8,
        minZoom: 6,
        });      
    
//add labels pane
map.createPane('labels');
map.getPane('labels');
    
//setup popups to show on top of label pane
map.createPane('popupPane');
map.getPane('popupPane').style.zIndex = 900;
map.getPane('popupPane').style.pointerEvents = 'none';
   
//add stamen toner basemap to opening map       
var tonermap = 
    L.tileLayer('http://a.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
        attribution: '<a href="http://maps.stamen.com/toner-lite">Stamen Toner Tileset</a>'
        }).addTo(map);
    
        
//add alternate base map

var terrain =
    L.tileLayer('http://a.tile.stamen.com/terrain-background/{z}/{x}/{y}.png', {attribution: '<a href="http://maps.stamen.com/terrain-background/">Stamen Terrain Background Tileset</a>'}).addTo(map);
        
    
var baseMaps = {
    "Grayscale": tonermap,
    "Terrain": terrain,
    };
    
//setup labels for overlay
L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}.{ext}', {
    subdomains: 'abcd',
    ext: 'png',
    pane: 'labels'
  }).addTo(map);


//var overlayMaps = {
//    "Funded Cities": fundedPtsLayer,
//    "Unfunded Cities": unfundedPtsLayer
//    };
    
//NOT WORKING    
//insert control for basemap layers placeholder
//L.control.layers(baseMaps, overlayMaps).addTo(map);

    
//insert control for basemap layers placeholder
L.control.layers(baseMaps).addTo(map);

 
    
// Create additional Control placeholders
function addControlPlaceholders(map) {
    var corners = map._controlCorners,
        l = 'leaflet-',
        container = map._controlContainer;

    function createCorner(vSide, hSide) {
        var className = l + vSide + ' ' + l + hSide;
        corners[vSide + hSide] = L.DomUtil.create('div', className, container);
    }
    createCorner('verticalcenter', 'left');
    createCorner('verticalcenter', 'right');
}
addControlPlaceholders(map);
    
//not centered vertically
map.zoomControl.setPosition('bottomright');

//add scale bar to bottom right of map window
L.control.scale({position:
         'bottomleft'}).addTo(map);
    
    
// add google search control
new L.Control.GeoSearch({
    provider: new L.GeoSearch.Provider.Google(), position: 'bottomleft'
  }).addTo(map);



   
    
//show project locations
//getcityData(map);   

    
function addDataToMap(projectPts, map) {
    var projectPtsLayer = L.geoJson(projectPts, {
      
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {radius: 8, fillColor: "#014636", fillOpacity: 0.85, opacity: 0.0});
        }, 
        onEachFeature: function(feature, layer) {
            var popupText = "<b>Project City Information</b>" + "<br>Project City: " + feature.properties.MCD_NAME
                + "<br>Total Projects Funded: " + feature.properties.TTLFUNDED
                + "<br>Total Projects Unfunded: " + feature.properties.TTLUNFUND;
            layer.bindPopup(popupText);}
        });
    projectPtsLayer.addTo(map);
}

$.getJSON("data/STIP_SRTS_MCDPTS.geojson.json", function(projectPts) {addDataToMap(projectPts, map);
});
    
    
//ADD FUNDED POINTS TO MAP
//function addDataToMap(fundedPts, map) {

//    var fundedPtsLayer = L.geoJson(fundedPts, {

//        pointToLayer: function(feature, latlng) {
//            return new L.CircleMarker(latlng, {radius: 12, fillColor: "#ff7800", fillOpacity: 0.85});
//        },        
//        onEachFeature: function(feature, layer) {
//            var popupText = "Project City: " + feature.properties.MCD_NAME
//                + "<br>Total Projects Funded: " + feature.properties.TTLFUNDED
//                + "<br>Total Projects Unfunded: " + feature.properties.TTLUNFUND;
//            layer.bindPopup(popupText);
//        }
//        });
//    fundedPtsLayer.addTo(map);
//}

//$.getJSON("data/STIP_SRTS_CITIES_Funded.geojson.json", function(fundedPts) //{addDataToMap(fundedPts, map);
//});
    
//ADD UNFUNDED POINTS TO MAP

//function addDataToMap(unfundedPts, map) {
    
//    var unfundedPtsLayer = L.geoJson(unfundedPts, {
        
//        pointToLayer: function(feature, latlng) {
//            return new L.CircleMarker(latlng, {radius: 4, fillColor: "#aa1100", fillOpacity: 0.85});
//        },      
//        onEachFeature: function(feature, layer) {
//            var popupText = "Project City: " + feature.properties.MCD_NAME
//                + "<br>Total Projects Funded: " + feature.properties.TTLFUNDED
//                + "<br>Total Projects Unfunded: " + feature.properties.TTLUNFUND;
//            layer.bindPopup(popupText);}
//        });
//    unfundedPtsLayer.addTo(map);
//}
    
//function createPtsButton(projectPtsLayer){
//    //when clicked, turn on min layer unless it's already on, then you turn off
//       $(".projectButton").click(function(){
//            if (map.hasLayer(projectPts)){
//                map.removeLayer(projectPts);
//            } else {
//                map.addLayer(projectPts);
//            }
//       });
//    } //end createMinMax



    
//$.getJSON("data/TRANSPDISTRICTSB.geojson.json", function(distbounds) {addDataToMap(distbounds, map);
//});
   
    
    
dropdown(map);

showDropdown(map);
    

function showDropdown(map) {

    $('#blank').click(function() {
      removeAllLayers(map);
    });

    $('#populationCities').click(function(){
      
      removeAllLayers(map);
      getPopulationData(map);
      
    });

    $('#SRTSFundedCities').click(function(){
       
      removeAllLayers(map);
      getSRTSFundedData(map);
    
    }); 

    $('#SRTSUnfundedCities').click(function(){
    
      removeAllLayers(map);
      getSRTSUnfundedData(map);
      
    });

    $('#STIPFundedCities').click(function(){
  
      removeAllLayers(map);
      getSTIPFundedData(map);
      
    });
    $('#STIPUnfundedCities').click(function(){
  
      removeAllLayers(map);
      getSTIPUnfundedData(map);
      
    });

    $('#TTLFundedCities').click(function(){
   
      removeAllLayers(map);
      getTotalFundedData(map);
      
    });
    $('#TTLUnfundedCities').click(function(){
   
      removeAllLayers(map);
      getTotalUnfunded(map);
      
    });
    
    $('#DISTRICTLayer').click(function(){
   
      removeAllLayers(map);
      getTotalDistrict(map);
      
    });
  };

};

//end of create map


    
function removeAllLayers (map) {

  console.log(X);
  
  if (X===1){
    map.removeLayer(populationCitiesLayer);
  } else if (X===2){
    map.removeLayer(SRTSFundedCitiesLayer);
  } else if (X===3){
    map.removeLayer(SRTSUnfundedCitiesLayer);
  } else if (X===4){
    map.removeLayer(STIPFundedCitiesLayer)
  } else if (X===5){
    map.removeLayer(STIPUnfundedCitiesLayer);
  } else if (X===6){
    map.removeLayer(TTLFundedCitiesLayer);
  } else if (X===7){
    map.removeLayer(TTLUnfundedCitiesLayer);
  } else if (X===8){
    map.removeLayer(DISTRICTLayer);
  } 
};


function dropdown (map) {

// move drop down menu
var legend = L.control({position: 'topleft'});
    legend.onAdd = function (map) {

//labels for drop down menu
    var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = 

            '<select><option id="blank">Select a Variable</option><option id ="populationCities">Project City Population</option><option id ="SRTSFundedCities">SRTS Funded Projects</option><option id ="SRTSUnfundedCities">SRTS Unfunded Projects</option><option id ="STIPFundedCities">STIP Funded Projects</option><option id ="STIPUnfundedCities">STIP Unfunded Projects</option><option id ="TTLFundedCities">Total Funded Projects</option><option id ="TTLUnfundedCities">Total Unfunded Projects</option><option id ="DISTRICTLayer">District Project Summary</option></select>'

    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
    };

legend.addTo(map);
};

function updateLegend(){

  if (X===1){
    $(".legendLabel").remove();
    $("#break0").append($("<p class='legendLabel'>Pedestrian & Bicycle Project Cities Combined Population</p>"))
    $("#label1").append($("<p class='legendLabel'>0-</p>" + "<p class='legendLabel'>6,500</p>"))
    $("#label2").append($("<p class='legendLabel'>6,500-</p>" + "<p class='legendLabel'>18,500</p>"))
    $("#label3").append($("<p class='legendLabel'>18,500-</p>" + "<p class='legendLabel'>39,500</p>"))
    $("#label4").append($("<p class='legendLabel'>39,500-</p>" + "<p class='legendLabel'>89,500</p>"))
    $("#label5").append($("<p class='legendLabel'>89,500-</p>" + "<p class='legendLabel'>382,500</p>"))
  } else if (X===2){
    $(".legendLabel").remove();
    $("#break0").append($("<p class='legendLabel'>Funded Safe Routes to School Projects</p>"))
    $("#label1").append($("<p class='legendLabel'>0-1</p>"))
    $("#label2").append($("<p class='legendLabel'>2-3</p>"))
    $("#label3").append($("<p class='legendLabel'>4-5</p>"))
    $("#label4").append($("<p class='legendLabel'>6-7</p>"))
    $("#label5").append($("<p class='legendLabel'>8-10</p>"))
  } else if (X===3){
    $(".legendLabel").remove();
    $("#break0").append($("<p class='legendLabel'>Unfunded Safe Routes to School Projects</p>"))
    $("#label1").append($("<p class='legendLabel'>0</p>" ))
    $("#label2").append($("<p class='legendLabel'>1</p>" ))
    $("#label3").append($("<p class='legendLabel'>2</p>" ))
    $("#label4").append($("<p class='legendLabel'>3-4</p>"))
    $("#label5").append($("<p class='legendLabel'>5-6</p>"))
  } else if (X===4){
    $(".legendLabel").remove();
    $("#break0").append($("<p class='legendLabel'>Funded State Transportation Improvement Projects</p>"))
    $("#label1").append($("<p class='legendLabel'>0-2</p>"))
    $("#label2").append($("<p class='legendLabel'>3-5</p>"))
    $("#label3").append($("<p class='legendLabel'>6-9</p>"))
    $("#label4").append($("<p class='legendLabel'>10-14</p>"))
    $("#label5").append($("<p class='legendLabel'>15-21</p>"))
  } else if (X===5){
    $(".legendLabel").remove();
    $("#break0").append($("<p class='legendLabel'>Unfunded State Transportation Improvement Projects</p>"))
    $("#label1").append($("<p class='legendLabel'>0</p>" ))
    $("#label2").append($("<p class='legendLabel'>1</p>" ))
    $("#label3").append($("<p class='legendLabel'>2-3</p>"))
    $("#label4").append($("<p class='legendLabel'>4-5</p>"))
    $("#label5").append($("<p class='legendLabel'>6-7</p>"))
  } else if (X===6){
    $(".legendLabel").remove();
    $("#break0").append($("<p class='legendLabel'>Total Funded Pedestrian & Bicycle Projects</p>"))
    $("#label1").append($("<p class='legendLabel'>0-2</p>"))
    $("#label2").append($("<p class='legendLabel'>3-5</p>"))
    $("#label3").append($("<p class='legendLabel'>6-9</p>"))
    $("#label4").append($("<p class='legendLabel'>10-15</p>"))
    $("#label5").append($("<p class='legendLabel'>16-29</p>"))
  } else if (X===7){
    $(".legendLabel").remove();
    $("#break0").append($("<p class='legendLabel'>Total Unfunded Pedestrian & Bicycle Projects</p>"))
    $("#label1").append($("<p class='legendLabel'>0-1</p>"))
    $("#label2").append($("<p class='legendLabel'>2-3</p>"))
    $("#label3").append($("<p class='legendLabel'>4-5</p>"))
    $("#label4").append($("<p class='legendLabel'>6-8</p>"))
    $("#label5").append($("<p class='legendLabel'>9-11</p>"))
  } else if (X===8){
    $(".legendLabel").remove();
    $("#break0").append($("<p class='legendLabel'>Districts by Name Label Value</p>"))
  } 
}



//Import GeoJSON data
function getPopulationData(map){
  X=1
  $.getJSON("data/TRANSPDISTRICTS.geojson",
            
            function(districtProjects){

  function getColor(d) {
    return d > 89719 ? '#2C4257' : // high end of break 382492
           d > 39266 ? '#436F74' :
           d > 18655 ? '#63A68D' :
           d > 6670 ? '#D5D786' :
           d <= 6669 ? '#F1EABC' :
                      '#FFFFFF';
  }
  function style(feature) {
     console.log (feature);
    return {
        fillColor: getColor(feature.properties.POP2000),
        weight: .5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.65,
        zIndex: 2
    };
  }

populationCitiesLayer = L.geoJson(districtProjects, {
  style: style,
     onEachFeature: function(feature, layer) {
        var popupText = "<b>District Information</b>" + "<br>District: " + feature.properties.DISTRICT + "<br>Project Cities Sum Population: " + feature.properties.POP2000;
    layer.bindPopup(popupText);},

    }).addTo(map).bringToBack();

//var popupText = "District: " + feature.properties.DISTRICT;
//    layer.bindPopup(popupText);
    updateLegend();
})};
            

function getSRTSFundedData(map){
  X=2
  $.getJSON("data/TRANSPDISTRICTS.geojson",function(districtProjects){

  function getColor(d) {
    return d > 7 ? '#2C4257' :  // high end of break 10
           d > 5 ? '#436F74' :
           d > 3 ? '#63A68D' :
           d > 1 ? '#D5D786' :
           d <= 1 ? '#F1EABC' :
                      '#FFFFFF';
  }
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.SRTSFUNDED),
        weight: .5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6,
        zIndex: 2
    };
  }

SRTSFundedCitiesLayer = L.geoJson(districtProjects, {
    style: style,
    onEachFeature: function(feature, layer) {
        var popupText = "<b>District Information</b>" + "<br>District: " + feature.properties.DISTRICT + "<br>SRTS Projects Funded: " + feature.properties.SRTSFUNDED;
    layer.bindPopup(popupText);}
    }).addTo(map).bringToBack();
  });

  updateLegend();
};


function getSRTSUnfundedData(map){
  X=3
  $.getJSON("data/TRANSPDISTRICTS.geojson",function(districtProjects){

  function getColor(d) {
    return d > 4 ? '#2C4257' :  // high end of break 6
           d > 2 ? '#436F74' :
           d > 1 ? '#63A68D' :
           d > 0 ? '#D5D786' :
           d = 0 ? '#F1EABC' :
                      '#FFFFFF';
  }
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.SRTSUNFUND),
        weight: .5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6,
        zIndex: 2
    };
  }

 SRTSUnfundedCitiesLayer = L.geoJson(districtProjects, {
  style: style,
     onEachFeature: function(feature, layer) {
        var popupText = "<b>District Information</b>" + "<br>District: " + feature.properties.DISTRICT + "<br>SRTS Projects Unfunded: " + feature.properties.SRTSUNFUND;
    layer.bindPopup(popupText);}

}).addTo(map).bringToBack();
  });

  updateLegend();
};


function getSTIPFundedData(map){
  X=4
  $.getJSON("data/TRANSPDISTRICTS.geojson",function(districtProjects){

  function getColor(d) {
    return d > 14 ? '#2C4257' :  // high end of break 21
           d > 9  ? '#436F74' :
           d > 5  ? '#63A68D' :
           d > 2  ? '#D5D786' :
           d <= 2 ? '#F1EABC' :
                      '#FFFFFF';
  }
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.STIPFUNDED),
        weight: .5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6,
        zIndex: 2
    };
  }

 STIPFundedCitiesLayer = L.geoJson(districtProjects, {
  style: style,
    onEachFeature: function(feature, layer) {
        var popupText = "<b>District Information</b>" + "<br>District: " + feature.properties.DISTRICT + "<br>STIP  Projects Funded: " + feature.properties.STIPFUNDED;
    layer.bindPopup(popupText);}
    }).addTo(map).bringToBack();

  });

  updateLegend();
};


function getSTIPUnfundedData(map){
  X=5
  $.getJSON("data/TRANSPDISTRICTS.geojson",function(districtProjects){

  function getColor(d) {
    return d > 5 ? '#2C4257' :  // high end of break 7
           d > 3 ? '#436F74' :
           d > 1 ? '#63A68D' :
           d > 0 ? '#D5D786' :
           d = 0 ? '#F1EABC' :
                      '#FFFFFF';
  }
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.STIPUNFUND),
        weight: .5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6,
        zIndex: 2
    };
  }

 STIPUnfundedCitiesLayer = L.geoJson(districtProjects, {
  style: style,
    onEachFeature: function(feature, layer) {
        var popupText = "<b>District Information</b>" + "<br>District: " + feature.properties.DISTRICT + "<br>STIP Projects Unfunded: " + feature.properties.STIPUNFUND;
    layer.bindPopup(popupText);}

}).addTo(map).bringToBack();
  });

  updateLegend();
};


function getTotalFundedData(map){
  X=6
  $.getJSON("data/TRANSPDISTRICTS.geojson",function(districtProjects){

  function getColor(d) {
    return d > 15 ? '#2C4257' : // high end of break 29
           d > 9  ? '#436F74' :
           d > 5  ? '#63A68D' :
           d > 2  ? '#D5D786' :
           d <= 2 ? '#F1EABC' :
                      '#FFFFFF';
  }
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.TTLFUNDED),
        weight: .5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6,
        zIndex: 2
    };
  }

 TTLFundedCitiesLayer = L.geoJson(districtProjects, {
    style: style,
    onEachFeature: function(feature, layer) {
        var popupText = "<b>District Information</b>" + "<br>District: " + feature.properties.DISTRICT + "<br>Total  Projects Funded: " + feature.properties.TTLFUNDED;
    layer.bindPopup(popupText);}
    }).addTo(map).bringToBack();
  });

  updateLegend();
};



function getTotalUnfunded(map){
  X=7
  $.getJSON("data/TRANSPDISTRICTS.geojson",function(districtProjects){

  function getColor(d) {
    return d > 8 ? '#2C4257' : // high end of break 11
           d > 5 ? '#436F74' :
           d > 3 ? '#63A68D' :
           d > 1 ? '#D5D786' :
           d <= 1 ? '#F1EABC' :
                      '#FFFFFF';
  }
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.TTLUNFUND),
        weight: .5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6,
        zIndex: 2
    };
  }

 TTLUnfundedCitiesLayer = L.geoJson(districtProjects, {
  style: style,
    onEachFeature: function(feature, layer) {
        var popupText = "<b>District Information</b>" + "<br>District: " + feature.properties.DISTRICT + "<br>Total  Projects Unfunded: " + feature.properties.TTLUNFUND;
    layer.bindPopup(popupText);}
}).addTo(map).bringToBack();
  });
    
  updateLegend();
};

function getTotalDistrict(map){
  X=8
  $.getJSON("data/TRANSPDISTRICTS.geojson",function(districtProjects){
  
  function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: "#63A68D",
        fillColor: "63A68D",
        fillOpacity: 0.0,
        zIndex: 2
    };
  }
 

 DISTRICTLayer = L.geoJson(districtProjects, {
  style: style,
    onEachFeature: function(feature, layer) {
        var popupText = "<b>District Information</b>" + "<br>District: " + feature.properties.DISTRICT + "<br>Project Cities Sum Population: " + feature.properties.POP2000 + "<br>SRTS Projects Funded: " + feature.properties.SRTSFUNDED + "<br>SRTS Projects Unfunded: " + feature.properties.SRTSUNFUND + "<br>STIP  Projects Funded: " + feature.properties.STIPFUNDED + "<br>STIP Projects Unfunded: " + feature.properties.STIPUNFUND + "<br>Total  Projects Funded: " + feature.properties.TTLFUNDED + "<br>Total  Projects Unfunded: " +  feature.properties.TTLUNFUND;
    layer.bindPopup(popupText);}
}).addTo(map).bringToBack();
  });
    
  updateLegend();
};


//$.getJSON("data/TRANSPDISTRICTSB.geojson.json", function(distbounds) {addDataToMap(distbounds, map);
//});

//var checkboxesJson = {
//    "layer1": citiesFunded,
//    "layer2": citiesUnfunded
//};
//L.control.layers(null,checkboxesJson).addTo(map);

//GET DATA FOR DISTRICTS
 

    
    
    
    
    
    
    