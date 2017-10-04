import mapd from "../../../js-modules/maps/mapd.js";
import metro_select from "../../../js-modules/metro-select.js";

export default function metro_map(container, data){
	var wrap = d3.select(container).classed("c-fix",true);
	var map_wrap = wrap.append("div").classed("col-lg",true);
	
	var bar_wrap = wrap.append("div").classed("col-sm",true)
						.style("overflow","auto")
						.style("border","1px solid #aaaaaa")
						.style("border-width","1px 0px")
						.style("margin-top","4em");
	var bar_svg = bar_wrap.append("svg").attr("width","100%").attr("height",100*30 + 20);

	var lookup = metro_select().lookup;
	
	var map = mapd(map_wrap.node()).zoomable(false).responsive(false);
	var state_layer = map.layer().geo(map.geo("state")).attr("stroke","#999999").attr("fill","none");
	var metro_layer = map.layer().geo(map.geo("metro").filter(function(d){return d.t100==1})).attr("stroke","#999999");

	var metros = data.metro;

	var category = "tot";

	var tooltip = function(obs){

		var tip = d3.select(this); //.text(JSON.stringify(obs));
		tip.text(lookup(obs.cbsa).name);

	}

	var draw = function(data){
		var domain = d3.extent(metros, function(d){return category=="pc" ? d.tot/d.pop : d[category]});

		metro_layer.data(data, "cbsa");
		var scale = metro_layer.aes.fill("value").quantile(['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c']); //.domain(domain);
		var r = metro_layer.aes.r("value");
		map.draw();

		metro_layer.tooltips(tooltip);

		var bg_u = bar_svg.selectAll("g").data(data, function(d){return d.cbsa});
			bg_u.exit().remove();
		var bg_e = bg_u.enter().append("g");
			bg_e.append("rect").classed("bg-rect",true).attr("fill","transparent").attr("stroke","none").attr("width","100%").attr("height","30");
			bg_e.append("rect").classed("bar-rect",true).attr("x","2.5%").attr("height","7px");
			bg_e.append("text").attr("x","2.5%").attr("dy",20).style("font-size","13px").style("cursor","default");

		var bg = bg_e.merge(bg_u);

		bg.select("rect.bar-rect").transition()
						.attr("y", function(d,i){return i*30 + 10})
						.attr("width", function(d,i){return ((d.value/domain[1])*95)+"%" })
						.attr("fill",function(d){
							return scale.map(d);
						});

		bg.select("rect.bg-rect").transition().attr("y", function(d,i){return i*30 + 10});

		bg.select("text").text(function(d){return lookup(d.cbsa).nameshort + " (" + d.value + ")"})
						 .transition().attr("y", function(d,i){return i*30 + 10});

		var timer;
		bg.style("pointer-events","all")
			.on("mouseenter", function(d){
				clearTimeout(timer);
				metro_layer.tooltips().highlight(d.cbsa, tooltip);
			})
			.on("mouseleave", function(){
				timer = setTimeout(function(){
					metro_layer.tooltips().hide();
				}, 300)
			//console.log(lookup(d.cbsa).name);
			});


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
			var w = map.get_dim().width;
			if(h < 200 || w < 650){h = 200}
			else{h = h*0.78}
		}
		catch(e){
			var h = 350;
		}

		bar_wrap.style("height", h+"px").style("margin-top","3em");		
	}


	window.addEventListener("resize", get_draw);

	//get_draw("tot");
	//get_draw("irrigation");
	get_draw("thermoelectric");
}
