//import add_hand_icons from './add_hand_icons.js';

export default function interventions(){
	var I = {};

	//lists of policy ids
	var local = ["plan", "confront", "innovate"];
	var federal = ["finance","collab","target"];

	
	//policy text -- paragraphs separated by {p}
	var policy = {};

	//footnotes in same order as {f}s in the text
	var footnotes = {};

	////split by footnotes first, then by paragraphs so, do {f}{p} not the reverse

	//local
	policy.plan = 'As a starting point, developing more comprehensive water plans can encourage greater collaboration and strategic action.{p}Integrated water resources management, which involves coordinated water planning in light of different land use, economic, and environmental considerations, is helping cities and entire regions bring groups together in support of more efficient and equitable outcomes.{f} Integrated water planning efforts, of course, remain difficult to execute in reality among several different agencies and are not a catch-all solution for the water infrastructure issues that metro areas face nationally.{f} However, these efforts, including "One Water" planning, are helping utilities, industries, and other local leaders work more closely together to define their water priorities—from diversifying water supplies to forging new partnerships to supporting more affordable water access.{f}';
	footnotes.plan = ['American Planning Association, "APA Policy Guide on Water," 2016, <a href="https://www.planning.org/policy/guides/adopted/water/">https://www.planning.org/policy/guides/adopted/water/</a> (accessed June 2017).', 
		'This is especially true when current efforts—outlined by EPA—continue to define integrated planning more closely in terms of wastewater and stormwater rather than drinking water, as is the case in Baltimore. For more, see: City of Baltimore, "Baltimore Integrated Planning Framework (IPF) Approach," <a href="http://dpwapps.baltimorecity.gov/cleanwaterbaltimore/baltimore-integrated-planning-framework-ipf-approach/">http://dpwapps.baltimorecity.gov/cleanwaterbaltimore/baltimore-integrated-planning-framework-ipf-approach/</a> (accessed June 2017).', 'U.S. Water Alliance, 2016.'];

	policy.confront = 'In much the same way, beyond planning, metro leaders must also confront a complicated and long-standing barrier to efficient and equitable water use: how to pay for infrastructure maintenance and upgrades.{p}Utilities, in particular, are facing a crunch to provide reliable, affordable water, often for a growing customer base. The creation of more robust water asset management plans and the development of new revenue streams are two of the major types of efforts underway, which both hold promise for improved regional water management and addressing the cost of service. For example, utilities tend to rely on volumetric charges to generate revenue, but they are also turning more toward fixed fees—such as connection charges—to provide revenue stability regardless of the levels of water used.{f} In addition, several localities are creating (or strengthening) customer assistance programs, which offer useful models to consider in alleviating the cost burden on lower-income households.{f}';
	footnotes.confront = ['Brett Walton, "Price of Water 2017: Four Percent Increase in 30 Large U.S. Cities," <em>Circle of Blue</em>, May 18, 2017, <a href="http://www.circleofblue.org/2017/water-management/pricing/price-water-2017-four-percent-increase-30-large-u-s-cities/">http://www.circleofblue.org/2017/water-management/pricing/price-water-2017-four-percent-increase-30-large-u-s-cities/</a> (accessed June 2017).', 'City of Philadelphia, "Customer Assistance Programs—Tiered Assistance Program (TAP)," <a href="http://www.phila.gov/water/educationoutreach/customerassistance/pages/default.aspx">http://www.phila.gov/water/educationoutreach/customerassistance/pages/default.aspx</a> (accessed June 2017).'];

	policy.innovate = 'In addition to exploring new plans and financial tools, metro leaders should emphasize technological innovation to drive additional efficiencies.{p}Reducing water withdrawals for thermoelectric power and irrigation are especially important in this way, but utilities and other local leaders should seek to incorporate more efficient technologies across all categories of water use. The key is stimulating the widespread investment in and use of these new technologies. By doing so, regions may spend more money today, but they can save more money tomorrow through reduced infrastructure costs (and lower customer bills). For instance, limiting the amount of energy and waste that water utilities themselves produce is key, which several regions are already addressing through better leak detection, water reuse, and other new treatment processes.';
	footnotes.innovate = [];

	//federal
	policy.finance = 'First, as with all types of infrastructure nationally, these state and federal efforts must address sticky questions on how to pay for future improvements.{p}Although the water funding gap is significant and more overall investment would help utilities, in particular, operate with greater certainty, this does not mean that state and federal leaders should swing for the fences.{f} Instead, state and federal leaders should pursue a combination of short-term and long-term strategies, based on a reasonable expectation to get certain projects done.{f} For example, at the federal level, an infusion of new funding for SRFs would provide a stronger channel for additional state and local investment,{f} but offering greater financial flexibility via a strengthened Water Infrastructure Finance and Innovation Act (WIFIA) program would also offer a clearer outlet to pursue a variety of different projects.{f}';
	footnotes.finance = ['The lack of clarity concerning the Trump administration\'s $1 trillion infrastructure plan has demonstrated the difficulty in getting broad actions done. For more, see: Adie Tomer and Joseph Kane, "At the Moment, an \'Infrastructure Bill\' Is Washington Fantasy" (Washington, DC: Brookings Institution, 2017).', 'Adie Tomer and Joseph Kane, <em>Short- and Long-Term Strategies to Renew American Infrastructure</em> (Washington, DC: Brookings Institution, 2016).', 'U.S. Government Accountability Office, 2013.', 'Claudia Copeland, Steven Maguire, and William J. Mallett, <em>Legislative Options in the 114th Congress for Financing Water Infrastructure</em> (Washington, DC: Congressional Research Service, 2016).'];

	policy.collab = 'Alongside discussions on water finance, state and federal leaders should also develop more comprehensive plans and collaborations in support of regional infrastructure upgrades.{p}Many states have long adopted such an approach—including the development of multistate collaborations focused on water management across political boundaries—and should continue to foster stronger partnerships. Federally, on the other hand, cross-agency collaborations and planning efforts remain a work in progress and must continue to pick up momentum. Nascent initiatives, such as the Urban Waters Federal Partnership, have helped increase coordination among different agencies to accelerate infrastructure improvements in economically distressed regions nationwide and offer a useful model to consider.{f}';
	footnotes.collab = ['For more on the Urban Waters Federal Partnership, see: <a href="https://www.epa.gov/urbanwaterspartners">https://www.epa.gov/urbanwaterspartners</a> (accessed June 2017).'];

	policy.target = 'While considering these new approaches, state and federal leaders must also recognize that improving regional water management involves a constantly moving target; as population and climate concerns continue to intensify, water needs will fluctuate widely and require an eye toward greater technological innovation.{p}In light of federal uncertainty in this space following the Paris Climate Agreement withdrawal by the Trump administration, states are in an especially strategic position to encourage innovations across metro and nonmetro areas. Following the precedent set in the clean energy sector, for instance, states should adjust inconsistent regulations, enact new performance standards, and consider other public benefit charges—via state-led innovation offices—to support more widespread technological innovation and adoption.{f}';
	footnotes.target = ['Ajami et al., 2014.'];

	//parse
	var policy2 = {};
	for(var p in policy){
		if(policy.hasOwnProperty(p)){
			var split0 = policy[p].split("{f}");

			var footnoted = "";
			split0.forEach(function(d,i){
				//don't footnote the last substring. if last character is footnote, then the last element in the array will be blank string, ""
				var super_note = (i < (split0.length-1)) ? '<sup style="vertical-align:super;">' + (i+1) + '</sup>' : '';
				footnoted = footnoted + d + super_note;
			}); 
			policy2[p] = footnoted.split("{p}");
		}
	}

	var body_wrap = d3.select("#metro-interactive");
	var show = function(id){
		d3.event.stopPropagation();
		var fixed = body_wrap.append("div")
			.style("position","fixed")
			.style("width","100%")
			.style("height","100%")
			.style("z-index","1000")
			.style("background-color","rgba(0, 0, 0, 0)")
			.style("top","0px")
			.style("left","0px")
			.classed("makesans",true)
			;

		var table = fixed.append("div")
			.style("display","table")
			.style("max-width","1000px")
			.style("width","90%")
			.style("height","100%")
			.style("margin","1em auto")
			.style("opacity","0");
		var row = table.append("div")
			.style("display","table-row");
		var cell = row.append("div")
			.style("display","table-cell")
			.style("vertical-align","middle")
			;

		var box_wrap = cell.append("div")
			.style("border","0px solid #ffffff")
			.style("padding","0px")
			.style("position","relative")
			.style("display","block")
			;

		var ribbon_cols = ["#0d73d6"];
		var svg_ribbon = box_wrap.append("div")
								 .style("height","10px")
								 .append("svg").attr("width","100%")
								 .attr("height","100%")
								 .style("x","0px")
								 .style("y","0px")
								.style("display","block")
								.selectAll("rect").data(ribbon_cols).enter()
								.append("rect").attr("width",(100/(ribbon_cols.length))+"%")
								.attr("height","100%").attr("x", function(d,i){return (i*(100/7))+"%"})
								.attr("fill", function(d,i){
									return ribbon_cols[i];
								});


		var x_height = 30;
		var x_width = x_height;

		var xsvg = box_wrap.append("div")
		   .style("cursor","pointer")
		   .classed("make-sans",true)
		   .style("position","absolute")
		   .style("top",(x_width)+"px")
		   .style("right",x_width+"px")
		   .style("width",x_width+"px")
		   .style("height",x_height+"px")
		   .style("z-index","10")
		   .append("svg")
		   .attr("width","100%").attr("height","100%")
		   ;

			xsvg.append("line").attr("x1","20%").attr("x2","80%").attr("y1","20%").attr("y2","80%");
			xsvg.append("line").attr("x1","20%").attr("x2","80%").attr("y1","80%").attr("y2","20%");

			xsvg.selectAll("line").attr("stroke","#0d73d6")
									.attr("stroke-width","5px");
		   ;

		var box = box_wrap.append("div").classed("makesans reading",true)
			.style("background-color","rgba(250, 250, 250, 1)")
			.style("position","relative")
			.style("padding","1rem")
			.style("line-height","1.4em")
			.style("overflow","auto")
			.style("max-height","85vh")
			.style("max-width","1000px")
			.style("z-index","5")
			;


			box.selectAll("p").data(policy2[id]).enter().append("p")
						.html(function(d){return d})
						.style("padding",function(d,i){
							return i==0 ? "0.5rem " + (x_width+20)+"px" + " 0rem 1rem" : "0rem 1rem 0rem 1rem";
						})
						.style("margin","1rem 0em 1.75rem 0em")
						.style("font-weight",function(d,i){return i==0 ? "bold" : "normal"})
						.style("font-size",function(d,i){return i==0 ? "1.5em" : null})
						;

		if(footnotes[id].length > 0){
			box.append("div").style("height","0.5em").style("width","30%")
				  .style("border-top","1px solid #aaaaaa")
				  .style("margin","0px 0px 0px 0.75rem");
			var footnote_wrap = box.append("div").style("margin","1rem");
			var footnote_text = footnote_wrap.selectAll("p").data(function(d){return footnotes[id] }).enter().append("p")
											.html(function(d,i){
												var super_note = '<sup style="vertical-align:super;">' + (i+1) + '</sup> ';
												return super_note + d;
											});
		}

		//show
		fixed.transition()
			.style("background-color","rgba(0, 0, 0, 0.75)")
			;
		table.transition().style("opacity","1");		

		box.on("mousedown", function(d,i){
			d3.event.stopPropagation();
		})

		fixed.on("mousedown", function(d,i){
			fixed.remove();
		});
		//
	}//end show


	//use 1: layout all the interventions in a large grid with text
	I.grid = function(container, local_policy){
		var wrap = d3.select(container).style("max-width","1600px").style("margin","0px auto");

		var data = arguments.length > 1 && !!local_policy ? 
					local.map(function(d){return {id:d, text:policy2[d]}}) : 
					federal.map(function(d){return {id:d, text:policy2[d]}}); 

		var row = wrap.selectAll("div").data([data])
							.enter().append("div")
							.classed("c-fix",true)
							.style("margin","0em 0em")
							;

		var tiles = row.selectAll("div.subway-tile").data(function(d){return d})
							.enter().append("div").classed("subway-tile",true);

		var headers = tiles.append("div").classed("tile-header",true);
		var dots = headers.append("div").classed("dot",true);
		//var dot_labels = dots.append("p").text(function(d){return d});


		var content = tiles.append("div").classed("tile-content reading",true);
		var text = content.selectAll("p").data(function(d){return d.text}).enter().append("p")
							.html(function(d){return d})
							.style("font-weight",function(d,i){return i==0 ? "bold" : "normal"})
							.style("font-size",function(d,i){return i==0 ? "1.15em" : null})
							;
		;

		content.each(function(d,i){
			var thiz = d3.select(this);
			if(footnotes[d.id].length > 0){
				thiz.append("div").style("height","0.5em").style("width","30%")
								  .style("border-top","1px solid #aaaaaa")
								  ;

				var footnote_wrap = thiz.append("div");
				var footnote_text = footnote_wrap.selectAll("p").data(function(d){return footnotes[d.id] }).enter().append("p")
												.html(function(d,i){
													var super_note = "<sup>" + (i+1) + "</sup> ";
													return super_note + d;
												});
			}
		});

		//more info available...

		tiles.append("div").classed("more-info-available",true);

		var expandable = {};
		var sizeCheck = function(){

			content.each(function(d,i){
				var bottom0 = this.parentNode.getBoundingClientRect().bottom;
				var bottom1 = this.getBoundingClientRect().bottom;
				expandable[(i+"")] = bottom1 > bottom0;
			});

			tiles.classed("click-for-more-info", function(d,i){
					if(expandable[(i+"")]){
						return true;
					}
					else{
						return false;
					}				
				});
			
			var uup = tiles.selectAll("div.zoomdiv").data(function(d,i){
				return expandable[(i+"")] ? [1] : [];
			});
			uup.exit().remove();
			var uen = uup.enter().append("div").classed("zoomdiv",true);
				uen.append("svg")
				uen.style("position","absolute")
					  .style("bottom","2em")
					  .style("right","3em")
					  .style("width","50px")
					  .style("height","50px")
					  .style("padding","0px")
					  .style("border","0px solid #0d73d6")
					  .style("background-color","rgba(255,255,255,0.8)")
					  .style("border-radius","25px")
					  ;

				var zoom_svg = uen.select("svg").attr("width","50px")
									    .attr("height","50px")
										.attr("viewBox","0 0 50 50");

				var zoom_in_g = zoom_svg.append("g").attr("transform","translate(0,-1030)")
												.attr("stroke-linecap","round")
												;	

				zoom_in_g.append("path").attr("d","m42.5 1055a17.5 17.5 0 0 1 -17.5 17.5 17.5 17.5 0 0 1 -17.5 -17.5 17.5 17.5 0 0 1 17.5 -17.5 17.5 17.5 0 0 1 17.5 17.5z").attr("fill","#0d73d6");
				zoom_in_g.append("path").attr("d","m19 1054.5 6.1902 6 5.8098-6")
										.attr("stroke","#ffffff").attr("stroke-linecap","square").attr("fill","none").attr("stroke-width","5")
										.attr("stroke-linejoin","round");


		}

		tiles.on("mousedown", function(d,i){
			if(expandable[(i+"")]){
				show(d.id);
			}
		});

		sizeCheck();

		window.addEventListener("resize", sizeCheck);


	}

	//unused here -- useful when you want a quick list of buttons
	I.grid_small = function(container, supercluster, text_color){
		var outer_wrap = d3.select(container);

		var col = arguments.length > 2 ? text_color : "#333333";

		outer_wrap.select("div.subway-tile-small-grid").remove();	

		var wrap = outer_wrap.append("div").classed("c-fix subway-tile-small-grid",true).style("padding-left","0px");	

		var text_wrap = wrap.append("div").classed("c-fix",true);
			text_wrap.append("p").text("Effective practices for this group")
						.style("float","left").style("margin","0em 1em 0em 0")
						.style("padding","0px 10px 0em 10px")
						.append("span")
						.style("margin-left","6px")
						.classed("hand-icon",true)
						;


		add_hand_icons(container);


		var rows = wrap.selectAll("div.intervention-row").data([descriptions.initials.slice(0)]) //,descriptions.initials.slice(4)])
							.enter().append("div").classed("c-fix intervention-row",true).style("margin","0.75em 0em 0.5em 0px")
							.style("float","left")
							;
								
							
		var dots = rows.selectAll("div.subway-tile-dot").data(function(d){return d})
							.enter().append("div").classed("subway-tile-dot",true).style("float","left")
							.style("margin","0em 0.175em 0.35em 0.175em")
							.style("cursor",function(d){
								return true;
							})
							.style("background-color", function(d){
								return "orange";
							})
							;

		dots.on("mousedown", function(d){
			show(d.id);
		});

		dots.append("p").text(function(d){return d})
							.style("color", function(d){
								return "#ffffff";
							});	

		var timer;
		var hover_text = wrap.append("p")
			.style("margin","0em 0em 0em 10px").style("font-size","1em")
			.style("font-style","italic")
			.style("clear","both")
			.html("&nbsp;")
			;

		dots.on("mouseenter", function(d){
			clearTimeout(timer);
			hover_text.text(descriptions.titles[d]).transition().duration(0).style("opacity",1);
		})	
		dots.on("mouseleave", function(d){
			timer = setTimeout(function(){
				hover_text.html("&nbsp;").transition().duration(400).style("opacity","0");
			},150);
		})	

	}

	return I;
}
