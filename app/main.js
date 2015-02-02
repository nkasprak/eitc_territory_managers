requirejs.config({
    "paths": {
        "map": "map",
        "irsmap" : "irs_map",
        "jquery": "node_modules/jquery/jquery.min",
        "raphael": "node_modules/raphaeljs/raphael.min",
        "uspaths": "us_paths",
        "mapcolors" : "mapcolors",
        "mapevents" : "mapevents",
        "eitcdata": "eitc_data",
        "legend" : "legend",
        "stateNames" : "statenames"
    }
});

requirejs(["irsmap"], function(map) {
    
});    