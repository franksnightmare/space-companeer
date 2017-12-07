console.log("Space Companeer: Loading SCIENCE");

Script.science = (function(){
	instance = {};
	
	instance.techs = {};
	instance.techs["unlockStorage"] = {available:true, done:false, unlocks:["unlockOil"], consequences:function(){}};
	instance.techs["unlockBasicEnergy"] = {available:true, done:false, unlocks:["unlockSolar", "unlockMachines", "upgradeEngineTech"], consequences:function(){Script.data.producerColumn = "charcoal"; Script.energyTier = 1;}};
	instance.techs["unlockOil"] = {available:false, done:false, unlocks:[], consequences:function(){Script.data.producerColumn = "oil";}};
	instance.techs["unlockSolar"] = {available:false, done:false, unlocks:["upgradeSolarTech"], consequences:function(){Script.energyTier = 2;}};
	instance.techs["unlockMachines"] = {available:false, done:false, unlocks:["unlockDestruction", "unlockSolarSystem", "upgradeResourceTech"], consequences:function(){Script.machineTier = 2; Script.goals.modifiers["energy"] = 1;}};
	instance.techs["unlockDestruction"] = {available:false, done:false, unlocks:[], consequences:function(){}};
	instance.techs["unlockSolarSystem"] = {available:false, done:false, unlocks:["unlockLabT2", "unlockRocketFuelT2"], consequences:function(){Script.data.producerColumn = "fuel"; Script.fuelTier = 1; Script.phase = 2;}};
	instance.techs["upgradeResourceTech"] = {available:false, done:false, unlocks:[], consequences:function(){}};
	instance.techs["unlockLabT2"] = {available:false, done:false, unlocks:["unlockLabT3"], consequences:function(){Script.labTier = 2;}};
	instance.techs["upgradeEngineTech"] = {available:false, done:false, unlocks:[], consequences:function(){}};
	instance.techs["unlockLabT3"] = {available:false, done:false, unlocks:["unlockLabT4"], consequences:function(){Script.labTier = 3;}};
	instance.techs["upgradeSolarTech"] = {available:false, done:false, unlocks:["unlockBatteries"], consequences:function(){}};
	instance.techs["unlockRocketFuelT2"] = {available:false, done:false, unlocks:["unlockRocketFuelT3"], consequences:function(){Script.fuelTier = 2;}};
	instance.techs["unlockBatteries"] = {available:false, done:false, unlocks:[], consequences:function(){}};
	instance.techs["efficiencyResearch"] = {available:false, done:false, unlocks:[], consequences:function(){Game.science.techs["efficiencyResearch"].done = false;}};
	instance.techs["unlockRocketFuelT3"] = {available:false, done:false, unlocks:[], consequences:function(){}};
	instance.techs["unlockLabT4"] = {available:false, done:false, unlocks:[], consequences:function(){}};
	
	instance.unlockTechs = function(self, techList)
	{
		for (id in techList)
		{
			for (key in self.techs)
			{
				if (techList[id] === key && !self.techs[key].available)
				{
					self.techs[key].available = true;
					Script.goals.newTechs += 1;
				}
			}
		}
	};
	
	instance.purchaseTech = function(self)
	{
		for (key in self.techs)
		{
			var tech = self.techs[key];
			if (tech.available && !tech.done)
			{
				purchaseTech(key);
				if (Game.tech.isPurchased(key))
				{
					self.techs[key].done = true;
					self.unlockTechs(self, tech.unlocks);
					
					Script.goals.newTechs -= 1;
					
					tech.consequences();
				}
			}
		}
	};
	
	return instance;
}());
