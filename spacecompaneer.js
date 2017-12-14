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
		Script.cons.resetCons(Script.cons);
		Script.cost.resetCost(Script.cost);
		
		if (Script.fuelTier >= 1) {Script.space.explorePlace(Script.space);}
		if (Script.phase >= 3) {Script.wonders.update(Script.wonders);}
		
		Script.data.update(Script.data);
		Script.energy.update(Script.energy);
		Script.science.update(Script.science);
		
		Script.setGoals(Script.goals)
		
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
