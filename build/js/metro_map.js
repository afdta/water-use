import mapd from "../../../js-modules/maps/mapd.js";

export default function state_map(container, data){
	var wrap = d3.select(container).classed("c-fix",true);
	var map_wrap = wrap.append("div").classed("col-lg",true);
	
	var bar_wrap = wrap.append("div").classed("col-sm",true)
						.style("overflow","auto")
						.style("border","1px solid #aaaaaa")
						.style("border-width","1px 0px")
						.style("margin-top","4em");
	var bar_svg = bar_wrap.append("svg").attr("width","100%").attr("height",100*15 + 20);
	
	var map = mapd(map_wrap.node()).zoomable(false).responsive(false);
	var state_layer = map.layer().geo(map.geo("state")).attr("stroke","#999999").attr("fill","none");
	var metro_layer = map.layer().geo(map.geo("metro").filter(function(d){return d.t100==1})).attr("stroke","#999999");

	var metros = data.metro;

	var category = "tot";

	var draw = function(data){
		var domain = d3.extent(metros, function(d){return category=="pc" ? d.tot/d.pop : d[category]});

		metro_layer.data(data, "cbsa");
		var scale = metro_layer.aes.fill("value").quantile(['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c']); //.domain(domain);
		var r = metro_layer.aes.r("value");
		map.draw();

		var bars = bar_svg.selectAll("rect").data(data, function(d){return d.cbsa});
		bars.exit().remove();
		bars.enter().append("rect").merge(bars).attr("x","10%").attr("height","14px").transition()
						.attr("y", function(d,i){return i*15 + 10})
						.attr("width", function(d,i){return ((d.value/domain[1])*80)+"%" })
						.attr("fill",function(d){
							return scale.map(d);
						})
						;
		size_bars();
	}

	var get_draw = function(){
		var D = data.metro.map(function(d){
			return {cbsa:d.cbsa, name:"name", value: category=="pc" ? d.tot/d.pop : d[category]}
		});

		D.sort(function(a,b){return b.value - a.value});

		draw(D);
	}	

	function size_bars(){
		try{
			var h = map.get_dim().height;
			if(h < 200){h = 200}
			if(h > 800){h = 600}
		}
		catch(e){
			var h = 350;
		}

		bar_wrap.style("height", (h*0.85)+"px").style("margin-top","3em");		
	}


	window.addEventListener("resize", get_draw);

	//get_draw("tot");
	//get_draw("irrigation");
	get_draw("thermoelectric");
}
