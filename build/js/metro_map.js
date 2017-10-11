import mapd from "../../../js-modules/maps/mapd.js";
import metro_select from "../../../js-modules/metro-select.js";
import format from "../../../js-modules/formats.js";
import select_menu from "../../../js-modules/select-menu.js";
import dimensions from "../../../js-modules/dimensions.js";
import {category_names as cn, category_options as co} from './category_names.js';

export default function metro_map(container, data){
	var wrap = d3.select(container).classed("c-fix",true)
								   .style("max-width","1600px")
								   .style("margin","8em auto 6em auto");

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
	var bar_svg = bar_wrap.append("svg").attr("width","100%").attr("height",100*30 + 20);


	var lookup = metro_select().lookup;
	
	var map = mapd(map_wrap.node()).zoomable(false).responsive(false);
	var state_layer = map.layer().geo(map.geo("state")).attr("stroke","#999999").attr("fill","none");
	var metro_layer = map.layer().geo(map.geo("metro").filter(function(d){return d.t100==1})).attr("stroke","#999999").attr("fill-opacity","0.9");

	var metros = data.metro;

	var category = "tot";


	//render map to div below map
	var legend_wrap = wrap.append("div").style("margin","0.5rem 1em 0.25rem 1.5rem").classed("map-legend",true);
	map.legend.wrap(legend_wrap.node()); 
	var redraw_legend = true;
	function draw_legend(fill, rad, domain){
		if(redraw_legend){
			var precision = "0";
			try{
				precision = domain[0] < 2 ? "1" : "0"
			}
			catch(e){
				precision = "0";
			}

			var fmt = category==="pc" ? function(v){return format.num0(v*1000)} : format["num"+precision];

			map.legend.swatch(fill.ticks(), function(v){
				return fmt(v[0]) + "–" + fmt(v[1]);
			}, (category=="pc" ? "Thousands of gallons per person, per day" : "Millions of gallons per day"), "left");
			map.legend.bubble(rad.ticks(), fmt, null, "left");
			redraw_legend = false; //dots never resize -- so only need to redraw legend when indicator changes
		}
	}

	var tooltip = function(obs){
		var tip = d3.select(this); //.text(JSON.stringify(obs));
		tip.html('<p style="margin:0em 0em 0.5em 0em"><strong>'+obs.name+'</strong></p> <p style="margin:0em;">'+obs.valuef+'</p>');
	}

	var draw = function(data){
		var domain = d3.extent(metros, function(d){return category=="pc" ? d.tot/d.pop : d[category]});

		metro_layer.data(data, "cbsa");
		var scale = metro_layer.aes.fill("value").quantile(['#c6dbef','#9ecae1','#6baed6','#3182bd','#08519c']); //.quantile(['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c']); //.domain(domain);
		var r = metro_layer.aes.r("value");
		map.draw();

		title.text(cn[category]);
		subtitle.text("100 largest metro areas");

		metro_layer.tooltips(tooltip);

		var bg_u = bar_svg.selectAll("g").data(data, function(d){return d.cbsa});
			bg_u.exit().remove();
		var bg_e = bg_u.enter().append("g");
			bg_e.append("rect").classed("bg-rect",true).attr("fill","transparent").attr("stroke","none").attr("width","100%").attr("height","30");
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

		bg.select("text").text(function(d,i){return (i+1) + ". " + lookup(d.cbsa).nameshort + " (" + d.valuef + ")"})
						 .transition().duration(1200).attr("y", function(d,i){return i*30 + 10});

		var timer;
		bg.style("pointer-events","all")
			.on("mouseenter", function(d){
				clearTimeout(timer);
				var that = this;
				setTimeout(function(){
					d3.select(that).select("rect.bg-rect").attr("fill","#dddddd");
				},0)
				metro_layer.tooltips().highlight(d.cbsa, tooltip);
			})
			.on("mouseleave", function(){
				bg.selectAll("rect.bg-rect").attr("fill","transparent");
				timer = setTimeout(function(){
					metro_layer.tooltips().hide();
				}, 300)
			});


		size_bars();
	

		draw_legend(scale, r, domain);

	}

	var get_draw = function(){
		var D = data.metro.map(function(d){
			var r = {cbsa:d.cbsa, name: lookup(d.cbsa).name, value: category=="pc" ? d.tot/d.pop : d[category]}
			r.valuef = category=="pc" ? format.num0(r.value*1000) + " gal./day" : format.num0(r.value) + " Mgal/d";
			return r;
		});

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

	var cat_menu = menu.append("div").style("float","right").style("margin-left","1.5rem");
	
	select_menu(cat_menu.node()).prompt("Select an indicator to map")
		.options(co)
		.callback(function(d){
			redraw_legend = true;
			category = this;
			get_draw();
		});

	//kick off
	get_draw();
}
