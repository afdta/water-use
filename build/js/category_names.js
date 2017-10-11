var category_names = {
	tot: "Total withdrawals (millions of gallons per day, Mgal/d)",
	pc: "Total withdrawals per capita (gallons per person, per day)",
	public_supply: "Withdrawals for public supply (Mgal/d)",
	thermoelectric: "Withdrawals for thermoelectric power (Mgal/d)",
	irrigation: "Withdrawals for irrigation (Mgal/d)",
	ind_self_supply: "Withdrawals for industrial uses (Mgal/d, self-supplied)",
	dom_self_supply: "Withdrawals for domestic self-supply (Mgal/d)",
	livestock: "Withdrawals for livestock (Mgal/d)",
	mining: "Withdrawals for mining (Mgal/d)",
	aquaculture: "Withdrawals for aquaculture (Mgal/d)"
};

var cat_options = ["tot", "pc", "public_supply", "thermoelectric", "irrigation", 
				   "ind_self_supply", "dom_self_supply", "livestock", "mining", "aquaculture"];

var category_options = cat_options.map(function(d,i){
	var o = {};
	o.value = d;
	o.text = category_names[d];
	o.disabled = false;
	return o;
});

export {category_names, category_options};