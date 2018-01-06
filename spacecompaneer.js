var SC_base = 'https://franksnightmare.github.io/space-companeer/';

var Script = (function() {
	
	var instance = {};
	instance.phase = 0;
	instance.machineTier = 1;
	instance.labTier = 1;
	
	instance.tier = {};
	instance.tier["rocketFuel"] = 0;
	instance.tier["plasma"] = 0;
	instance.tier["plasmaStorage"] = 0;
	instance.tier["meteorite"] = 0;
	instance.tier["battery"] = 0;
	
	instance.plasmaOn = false;
	
	instance.spaceCompaneer = function()
	{
		Script.plasmaOn = true;
		
		Script.upgradeStorage();
		
		Script.cons.resetCons(Script.cons);
		Script.cost.resetCost(Script.cost);
		
		if (Script.tier["rocketFuel"] >= 1) {Script.space.explorePlace(Script.space); Script.cons.addCons(Script.cons, "rocketFuel", 2);}
		if (Script.phase >= 2) {Script.cons.addCons(Script.cons, "oil", 5);}
		if (Script.phase >= 3) {Script.cons.addCons(Script.cons, "methane", 40);}
		if (Script.phase >= 4) {Script.wonders.update(Script.wonders); Script.cons.addCons(Script.cons, "lunarite", 100); Script.cons.addCons(Script.cons, "titanium", 100);}
		if (Script.machineTier >= 3) {Script.cons.addCons(Script.cons, "silicon", 200);}
		if (Script.data.producerColumn === "lunarite") {Script.cons.addCons(Script.cons, "lunarite", 10);}
		if (Script.data.producerColumn === "methane") {Script.cons.addCons(Script.cons, "lunarite", 20);}
		if (Script.data.producerColumn === "silicon" || Script.data.producerColumn === "silver" || Script.data.producerColumn === "hydrogen" || Script.data.producerColumn === "helium") {Script.cons.addCons(Script.cons, "lunarite", 50); Script.cons.addCons(Script.cons, "titanium", 50);}
		if (Script.energy.data["nuclear"].unlocked) {Script.cons.addCons(Script.cons, "rocketFuel", 5);}
		if (Script.energy.data["fusion"].unlocked) {Script.cons.addCons(Script.cons, "rocketFuel", 10);}
		if (Script.tier["meteorite"] >= 1) {Script.cons.addCons(Script.cons, "meteorite", 3);}
		
		Script.energy.update(Script.energy);
		if (getProduction("meteorite") >= 1) {Script.energy.dyson.update(Script.energy.dyson); Script.wonders.wonders["meteorite1"].available = true;}
		Script.data.update(Script.data);
		Script.science.update(Script.science);
		
		Script.cost.addCons(Script.cost);
		
		Script.cost.itterate(Script.cost);
		Script.cost.itterate(Script.cost);
		Script.cost.itterate(Script.cost);
		Script.cost.itterate(Script.cost);
		Script.cost.itterate(Script.cost);
		
		Script.goals.setGoals(Script.goals)
		
		if (Script.phase >= 3) {Script.goals["methane"].type = "urgent"; Script.goals["uranium"].type = "urgent"; Script.goals["lava"].type = "urgent"; Script.goals["hydrogen"].type = "urgent"; Script.goals["helium"].type = "urgent";}
		if (Script.data.producerColumn === "plasma" || Script.data.producerColumn === "meteorite") {Script.goals["helium"].type = "cons";}
		if (Script.tier["rocketFuel"] >= 3) {Script.goals["methane"].type = "cons";}
		
		Script.goals.build();
	};
	
	instance.boosterino = function()
	{
		var done = true;
		if (!getProduction('metal')) {gainResource('metal'); getMiner(); done = false;}
		if (!getProduction('gem')) {gainResource('gem'); getGemMiner(); done = false;}
		if (!getProduction('wood')) {gainResource('wood'); getWoodcutter(); done = false;}
		if (done) {
			instance.phase = 1;
			clearInterval(instance.boosterino_t);
			setInterval(instance.spaceCompaneer, 2000);
			Script.data.init(Script.data);
			Script.energy.init(Script.energy);
			console.log("Space Companeer: Phase 0 complete!");
		}
	};
	
	instance.waitEvenMore = function()
	{
		instance.boosterino_t = setInterval(instance.boosterino, 1000);
	};
	
	instance.waitMore = function()
	{
		setTimeout(instance.waitEvenMore, 1000);
		
		document.head.appendChild(document.createElement('script')).src = SC_base + 'dyson.js';
	};
	
	instance.init = function()
	{
		console.log("Space Companeer: Starting Space Companeer...");
		setTimeout(instance.waitMore, 1000);
		
		document.head.appendChild(document.createElement('script')).src = SC_base + 'energy.js';
		document.head.appendChild(document.createElement('script')).src = SC_base + 'utils.js';
		document.head.appendChild(document.createElement('script')).src = SC_base + 'data.js';
		document.head.appendChild(document.createElement('script')).src = SC_base + 'goals.js';
		document.head.appendChild(document.createElement('script')).src = SC_base + 'science.js';
		//document.head.appendChild(document.createElement('script')).src = SC_base + 'decisions.js';
		document.head.appendChild(document.createElement('script')).src = SC_base + 'space.js';
		document.head.appendChild(document.createElement('script')).src = SC_base + 'wonder.js';
		document.head.appendChild(document.createElement('script')).src = SC_base + 'cost.js';
		document.head.appendChild(document.createElement('script')).src = SC_base + 'consumption.js';
	};
	
	return instance;
}());

setTimeout(Script.init, 2000);
