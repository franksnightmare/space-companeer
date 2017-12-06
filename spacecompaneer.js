var SC_base = 'https://franksnightmare.github.io/space-companeer/';

var Script = (function() {
	
	var instance = {};
	instance.phase = 0;
	instance.machineTier = 1;
	instance.labTier = 1;
	instance.energyTier = 0;
	instance.fuelTier = 0;
	
	instance.spaceCompaneer = function()
	{
		Script.data.update(Script.data);
		
		Script.goals.update(Script.goals);
		Script.goals.print(Script.goals);
		
		Script.upgradeStorage();
		
		Script.decisions.decideResourceBuildings(Script.decisions);
		
		Script.decisions.decideEnergyBuilding(Script.decisions);
		Script.decisions.buildEnergyBuilding(Script.decisions);
		
		Script.goals.updateProductionGoals(Script.goals);
		Script.decisions.updateResourceFocus(Script.decisions, 1);
		
		Script.science.purchaseTech(Script.science);
		
		if (Script.goals.highestGoal(Script.goals) === "energy")
		{
			return;
		}
		
		Script.decisions.decideLabBuilding(Script.decisions);
		Script.decisions.buildLabs(Script.decisions);
		
		Script.decisions.buildResourceBuildings(Script.decisions);
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
			setInterval(instance.spaceCompaneer, 1000);
			Script.decisions.init(Script.decisions);
			Script.goals.modifiers["science"] = 1;
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
		document.head.appendChild(document.createElement('script')).src = SC_base + 'decisions.js';
	};
	
	return instance;
}());

setTimeout(Script.init, 2000);
