import dir from "../../../js-modules/rackspace.js";
import degradation from "../../../js-modules/degradation.js";


import state_map from "./state_map.js";
import metro_map from "./metro_map.js";
import interventions from "./interventions.js";


//main function
function main(){


  //local
  //dir.local("./");
  //dir.add("assets", "assets");

  var containers = {};
  containers.metro_map = document.getElementById("metro-map");
  containers.state_map = document.getElementById("state-map");


  //production data
  dir.add("assets", "water-use/assets");

  var compat = degradation(document.getElementById("metro-interactive"));

  //browser degradation
  if(compat.browser()){
    d3.json(dir.url("assets", "water.json"), function(error, data){
      if(error){
        compat.alert(containers.metro_map);
        compat.alert(containers.state_map);
      }

      metro_map(containers.metro_map, data);
      state_map(containers.state_map, data);

      var I = interventions();

      I.grid(document.getElementById("local-strategies"), "local");
      I.grid(document.getElementById("state-and-federal-strategies"))

      d3.select("#water-change-graphic").append("img")
          .attr("src", dir.url("assets", "change_by_cat_metro_nonmetro.svg"));

      d3.select("#water-category-graphic").append("img")
          .attr("src", dir.url("assets", "share_by_cat_metro_nonmetro.svg"));

    });
  }


} //close main()


document.addEventListener("DOMContentLoaded", main);
