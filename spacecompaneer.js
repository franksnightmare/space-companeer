var SC_base = 'https://franksnightmare.github.io/space-companeer/';

var Script = (function() {
	
	var instance = {};
	instance.phase = 0;
	instance.machineTier = 1;
	instance.labTier = 1;
	instance.energyTier = 0;
	instance.fuelTier = 0;
	instance.consumptionRemainder = 1;
	
	instance.spaceCompaneer = function()
	{
		Script.upgradeStorage();
		
		Script.cons.resetCons(Script.cons);
		Script.cost.resetCost(Script.cost);
		
		if (Script.fuelTier >= 1) {Script.space.explorePlace(Script.space); Script.cons.addCons(Script.cons, "rocketFuel", 2);}
		if (Script.phase >= 2) {Script.cons.addCons(Script.cons, "oil", 5); Script.cons.addCons(Script.cons, "wood", 100);}
		if (Script.phase >= 4) {Script.wonders.update(Script.wonders); Script.cons.addCons(Script.cons, "lunarite", 100); Script.cons.addCons(Script.cons, "titanium", 20);}
		if (Script.data.producerColumn === "lunarite") {Script.cons.addCons(Script.cons, "lunarite", 10);}
		if (Script.data.producerColumn === "methane") {Script.cons.addCons(Script.cons, "lunarite", 20);}
		if (Script.data.producerColumn === "silicon") {Script.cons.addCons(Script.cons, "lunarite", 50); Script.cons.addCons(Script.cons, "titanium", 10);}
		
		Script.data.update(Script.data);
		Script.energy.update(Script.energy);
		Script.science.update(Script.science);
		
		Script.cost.addCons(Script.cost);
		
		Script.cost.itterate(Script.cost);
		Script.cost.itterate(Script.cost);
		Script.cost.itterate(Script.cost);
		
		Script.goals.setGoals(Script.goals)
		
		Script.goals.build();
		
		//Script.goals.update(Script.goals);
		//Script.goals.print(Script.goals);
		
		//Script.upgradeStorage();
		
		//Script.decisions.decideResourceBuildings(Script.decisions);
		
		//Script.decisions.decideEnergyBuilding(Script.decisions);
		//Script.decisions.buildEnergyBuilding(Script.decisions);
		
		//Script.goals.updateProductionGoals(Script.goals);
		//Script.decisions.updateResourceFocus(Script.decisions, 3);
		
		//Script.science.purchaseTech(Script.science);
		//if (Script.fuelTier >= 1) {Script.space.explorePlace(Script.space);}
		
		//Script.decisions.buildResourceBuildings(Script.decisions);
		
		//Script.decisions.decideLabBuilding(Script.decisions);
		//Script.decisions.buildLabs(Script.decisions);
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
			// Script.decisions.init(Script.decisions);
			// Script.goals.modifiers["science"] = 1;
			console.log("Space Companeer: Phase 0 complete!");
		}
	};
	
	instance.waitMore = function()
	{
		instance.boosterino_t = setInterval(instance.boosterino, 1000);
	};
	
	instance.init = function()
	{
		console.log("Space Companeer: Starting Space Companeer...");
		setTimeout(instance.waitMore, 2000);
		
		document.head.appendChild(document.createElement('script')).src = SC_base + 'utils.js';
		document.head.appendChild(document.createElement('script')).src = SC_base + 'data.js';
		document.head.appendChild(document.createElement('script')).src = SC_base + 'goals.js';
		document.head.appendChild(document.createElement('script')).src = SC_base + 'science.js';
		//document.head.appendChild(document.createElement('script')).src = SC_base + 'decisions.js';
		document.head.appendChild(document.createElement('script')).src = SC_base + 'space.js';
		document.head.appendChild(document.createElement('script')).src = SC_base + 'wonder.js';
		document.head.appendChild(document.createElement('script')).src = SC_base + 'cost.js';
		document.head.appendChild(document.createElement('script')).src = SC_base + 'consumption.js';
		document.head.appendChild(document.createElement('script')).src = SC_base + 'energy.js';
	};
	
	return instance;
}());

setTimeout(Script.init, 2000);
