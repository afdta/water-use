import dir from "../../../js-modules/rackspace.js";
import degradation from "../../../js-modules/degradation.js";


import state_map from "./state_map.js";
import metro_map from "./metro_map.js";


//main function
function main(){


  //local
  dir.local("./");
  dir.add("data", "data");
  //dir.add("dirAlias", "path/to/dir");

  var containers = {};
  containers.metro_map = document.getElementById("metro-map");
  containers.state_map = document.getElementById("state-map");


  //production data
  //dir.add("data", "metro-water/data");
  //dir.add("dirAlias", "rackspace-slug/path/to/dir");
  var compat = degradation(document.getElementById("metro-interactive"));

  //browser degradation
  if(compat.browser()){
    d3.json(dir.url("data", "water.json"), function(error, data){
      if(error){
        compat.alert(containers.metro_map);
        compat.alert(containers.state_map);
      }

      metro_map(containers.metro_map, data);
      state_map(containers.state_map, data);

      //console.log(d3.selectAll(".hoello").nodes());

    });
  }


} //close main()


document.addEventListener("DOMContentLoaded", main);
