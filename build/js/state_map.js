import mapd from "../../../js-modules/maps/mapd.js";
import format from "../../../js-modules/formats.js";
import select_menu from "../../../js-modules/select-menu.js";
import dimensions from "../../../js-modules/dimensions.js";
import {category_names as cn, category_options as co} from './category_names.js';

export default function state_map(container, data){
	var wrap = d3.select(container).classed("c-fix",true)
								   .style("max-width","1600px")
								   .style("margin","6em auto 8em auto");

	var menu = wrap.append("div").classed("c-fix",true);

	var title = wrap.append("p").style("font-size","1.5em").style("margin","0rem 0.25rem 0.25rem 1.5rem");
	var subtitle = wrap.append("p").style("padding","0.25rem 1.5rem 0.25rem 1.5rem")
								.style("margin-bottom","0.75rem")
								.style("border-bottom","1px solid #aaaaaa");

	var col_wrap = wrap.append("div").classed("c-fix",true);
	var col0 = col_wrap.append("div").classed("col-lg",true);
	
	var map_wrap = col0.append("div");	
	var bar_wrap = col_wrap.append("div").classed("col-sm",true)
						.style("overflow","auto")
						.style("border","1px solid #aaaaaa")
						.style("border-width","1px 0px")
						.style("margin-top","4em");
	var bar_svg = bar_wrap.append("svg").attr("width","100%").attr("height",51*30 + 20);

	
	var map = mapd(map_wrap.node()).zoomable(false).responsive(false);
	var state_layer = map.layer().geo(map.geo("state")).attr("stroke","#999999");

	var states = data.state.total.concat(data.state.nonmetro, data.state.metro).filter(function(d){return d.fips != "US"});

	var category = "tot";
	var geo = "total";

	//render map to div below map
	var legend_wrap = wrap.append("div").style("margin","0.5rem 1em 0.25rem 1.5rem").classed("map-legend",true);
	map.legend.wrap(legend_wrap.node()); 
	var redraw_legend = true;
	function draw_legend(fill, domain){
		if(redraw_legend){
			var precision = "0";

			var fmt = category==="pc" ? function(v){return format.num0(v*1000)} : format["num"+precision];

			map.legend.swatch(fill.ticks(), function(v){
				return fmt(v[0]) + "–" + fmt(v[1]);
			}, (category=="pc" ? "Thousands of gallons per person, per day" : "Millions of gallons per day"), "left");

			redraw_legend = false; //dots never resize -- so only need to redraw legend when indicator changes
		}
	}

	var tooltip = function(obs){
		var tip = d3.select(this); 

		tip.html('<p style="margin:0em 0em 0.5em 0em"><strong>'+obs.name+'</strong></p> <p style="margin:0em;">'+(obs.valuef==null ? "N/A" : obs.valuef)+'</p>');

	}	

	var draw = function(data){
		//domain based on all state obs (metro/nonmetro/tot)
		var domain = d3.extent(states, function(d){return category=="pc" ? d.tot/d.pop : d[category]});

		state_layer.data(data, "fips");
		var scale = state_layer.aes.fill("value").quantile(['#c6dbef','#9ecae1','#6baed6','#3182bd','#08519c']); //.quantile(['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c']); //.domain(domain);
		map.draw();

		title.text(cn[category]);
		subtitle.text(geo=="total" ? "50 states" : 
									 (geo=="metro" ? "Metropolitan portions of the 50 states" : 
									 				 "Non-metropolitan portions of the 50 states"));		

		//custom data accessor for tooltip function to insert state name into data observation
		var dat_accessor = function(d){
			var obs = state_layer.lookup(d.properties.geo_id);
			if(obs!==null){
				//some states have 0 non-metro territory (NJ, RI, DE, DC)
				obs.name = d.properties.geo_name;
			}
			else{
				obs = {name: d.properties.geo_name}
			}

			return obs;
		}

		state_layer.tooltips(tooltip, dat_accessor).width(185);

		var bg_u = bar_svg.selectAll("g").data(data, function(d){return d.fips});
			bg_u.exit().remove();
		var bg_e = bg_u.enter().append("g");
			bg_e.append("rect").classed("bg-rect",true).attr("fill","transparent").attr("stroke","none").attr("width","100%").attr("height","25");
			bg_e.append("rect").classed("bar-rect",true).attr("x","2.5%").attr("height","7px").attr("stroke","#aaaaaa").style("shape-rendering","crispEdges");
			bg_e.append("text").attr("x","2.5%").attr("dy",20).style("font-size","13px").style("cursor","default");

		var bg = bg_e.merge(bg_u);

		bg.select("rect.bar-rect").transition().duration(1200)
						.attr("y", function(d,i){return i*30 + 10})
						.attr("width", function(d,i){return ((d.value/domain[1])*95)+"%" })
						.attr("fill",function(d){
							return scale.map(d);
						});

		bg.select("rect.bg-rect").transition().duration(1200).attr("y", function(d,i){return i*30 + 10});

		bg.select("text").text(function(d, i){return (i+1) + ". " +  d.usps+ " (" + d.valuef + ")"})
						 .transition().duration(1200).attr("y", function(d,i){return i*30 + 10});

		var timer;
		bg.style("pointer-events","all")
			.on("mouseenter", function(d){
				clearTimeout(timer);
				var that = this;
				setTimeout(function(){
					d3.select(that).select("rect.bg-rect").attr("fill","#dddddd");
				},0)
				state_layer.tooltips().highlight(d.fips);
			})
			.on("mouseleave", function(){
				bg.selectAll("rect.bg-rect").attr("fill","transparent");
				timer = setTimeout(function(){
					state_layer.tooltips().hide();
				}, 300)
			});


		size_bars();

		draw_legend(scale, domain);
	}

	var get_draw = function(){
		var D = data.state[geo].map(function(d){
			var r = {fips:d.fips, usps:d.state, value: category=="pc" ? d.tot/d.pop : d[category]}
			r.valuef = category=="pc" ? format.num0(r.value*1000) + " gal./day" : format.num0(r.value) + " Mgal/d";
			return r;
		}).filter(function(d){return d.fips != "US" && d.fips != "11"});

		D.sort(function(a,b){return b.value - a.value});

		draw(D);
	}	


	function size_bars(){
		try{
			var winwidth = dimensions().width;
			if(winwidth <= 950){
				var h = 200;
			}
			else{
				var h = map.get_dim().height*0.9;
			}
		}
		catch(e){
			var h = 350;
		}

		bar_wrap.style("height", h+"px").style("margin-top","3em");		
	}	


	window.addEventListener("resize", get_draw);

	var geo_menu = menu.append("div").style("float","right").style("margin-left","1.5rem");
	var cat_menu = menu.append("div").style("float","right").style("margin-right","0rem");

	select_menu(cat_menu.node()).prompt("Select an indicator to map")
		.options(co)
		.callback(function(d){
			redraw_legend = true;
			category = this;
			get_draw();
		});

	select_menu(geo_menu.node()).prompt("State portion to focus on").options([
		{value:"total", text:"Total (entire state)", disabled:false},
		{value:"metro", text:"Metropolitan portion of state", disabled:false},
		{value:"nonmetro", text:"Non-metropolitan portion of state", disabled:false}
	]).callback(function(d){
		geo = this;
		get_draw();
	});	


	//kick off
	get_draw();
}
