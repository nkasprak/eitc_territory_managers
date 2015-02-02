/*Code specific to this map*/

define(["map", "eitcdata", "jquery", "stateNames"], function (Map, eitcData, $, stateNames) {
    "use strict";
    
    var irs_map = {},
        data,
        reverseStateNames = {},
        stateCode;
    
    irs_map.subregions = {};
    
    for (stateCode in stateNames) {
        if (stateNames.hasOwnProperty(stateCode)) {
            reverseStateNames[stateNames[stateCode]] = stateCode;
        }
    }
    
    $.get("app/irs_territory_managers.csv", function (d) {
        var r = {}, i, j, state;
        d = d.split("\n");
        for (i = 0; i < d.length; i += 1) {
            d[i] = d[i].split(",");
            state = reverseStateNames[d[i][0]];
            if (typeof (state) !== "undefined") {
                if (typeof (r[state]) === "undefined") {
                    r[state] = {};
                    for (j = 0; j < d[i].length; j += 1) {
                        r[state][j] = d[i][j];
                    }
                    r[state][5] = 1;
                } else {
                    if (typeof (irs_map.subregions[state]) === "undefined") {
                        irs_map.subregions[state] = {};
                    }
                    irs_map.subregions[state][d[i][1]] = d[i];
                }
            }
        }
        irs_map.dataSource = r;
        
        /*Make the actual map object - all of the possible configuration options are used here
        except for the stateClick callback*/
        irs_map.map = new Map({

            /*Assign data to the map*/
            data: irs_map.dataSource,

            /*Each data point is an array (so that the popup can show more info than the colors) -
            this tells the map which quantity to use for the color scheme*/
            dataIndex: 5,

            /*Tell the object which div to paint the map inside*/
            mapDivID: "map",

            /*Not even sure if this works yet when true, but it will*/
            hideDC: false,

            /*Template for popup box. Function must return an HTML string*/
            popupTemplate: function (data, state) {
                function subTemplate(data) {
                    var htm = "";
                    htm += "IRS Territory Manager: " + data[2] + "<br />";
                    htm += "Phone: " + data[3] + "<br />";
                    htm += "Email: <a href='mailto:" + data[4] + "'>" + data[4] + "</a>";
                    return htm;
                }
                var subregion, htm = "";
                htm += "<b>" + stateNames[state] + "</b>:";
                if (irs_map.subregions[state]) {
                    for (subregion in irs_map.subregions[state]) {
                        if (irs_map.subregions[state].hasOwnProperty(subregion)) {
                            htm += "&nbsp;<br />" + subregion + ": <br />";
                            htm += subTemplate(irs_map.subregions[state][subregion]);
                            htm += "<br />";
                        }
                    }
                } else {
                    htm += "<br />" + subTemplate(data);
                }
                return htm;
            },

            /*Background color for popup*/
            popupStyle: {
                bgColor: "#dddddd"
                /*These options are also available though not used here*/
                /*padding: 10,
                fontSize: 28*/
            },

            /*Configure colors for map*/
            colorConfig: {
                highColor  : "#117b3c", //max of dataset
                lowColor   : "#fff0d3", //min of dataset
                hoverColor : "#f8c55b", //color when hovering over a state
                noDataColor: "#aaaaaa", //color for null or NaN data

                /*if dataset goes from negative to positive, it uses a three color gradient with
                the middle color at zero*/
                zeroColor  : "#ffffff"
            },

            customMax: 2,
            customMin: 0,

            /*Function to format the legend labels*/
            legendFormatter: function (t) {
                return Math.round(t * 10000) / 100 + "%";
            },
            
            hideUS: true,
            hideLegend: true

            /*Below is an example of how to define a state click callback, 
            though this particular map has no need for it*/
            /*stateClick: function (state) {
                console.log("you clicked on " + state);
            },*/
        });
        
    });
    
    
    
    
    
});