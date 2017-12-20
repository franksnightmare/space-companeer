console.log("Space Companeer: Loading SCIENCE");

Script.science = (function(){
	instance = {};
	
	instance.data = [{}, {}, {}, {}];
	instance.score = [{}, {}, {}, {}];
	instance.maxScore = 0;
	
	instance.techs = {};
	instance.techs["unlockStorage"] = {available:true, done:false, unlocks:["unlockOil"], consequences:function(){}};
	instance.techs["unlockBasicEnergy"] = {available:true, done:false, unlocks:["unlockSolar", "unlockMachines", "upgradeEngineTech"], consequences:function(){Script.data.producerColumn = "charcoal"; Script.energyTier = 1;}};
	instance.techs["unlockOil"] = {available:false, done:false, unlocks:[], consequences:function(){Script.data.producerColumn = "oil"; Script.phase = 2;}};
	instance.techs["unlockSolar"] = {available:false, done:false, unlocks:["upgradeSolarTech"], consequences:function(){Script.energyTier = 2;}};
	instance.techs["unlockMachines"] = {available:false, done:false, unlocks:["unlockDestruction", "unlockSolarSystem", "upgradeResourceTech"], consequences:function(){Script.machineTier = 2; Script.energy.energyPriority = 1;}};
	instance.techs["unlockDestruction"] = {available:false, done:false, unlocks:[], consequences:function(){}};
	instance.techs["unlockSolarSystem"] = {available:false, done:false, unlocks:["unlockLabT2", "unlockRocketFuelT2"], consequences:function(){Script.data.producerColumn = "rocketFuel"; Script.tier["rocketFuel"] = 1; Script.phase = 3;}};
	instance.techs["upgradeResourceTech"] = {available:false, done:false, unlocks:[], consequences:function(){}};
	instance.techs["unlockLabT2"] = {available:false, done:false, unlocks:["unlockLabT3"], consequences:function(){Script.labTier = 2;}};
	instance.techs["upgradeEngineTech"] = {available:false, done:false, unlocks:[], consequences:function(){}};
	instance.techs["unlockLabT3"] = {available:false, done:false, unlocks:["unlockLabT4"], consequences:function(){Script.labTier = 3;}};
	instance.techs["upgradeSolarTech"] = {available:false, done:false, unlocks:["unlockBatteries"], consequences:function(){}};
	instance.techs["unlockRocketFuelT2"] = {available:false, done:false, unlocks:["unlockRocketFuelT3"], consequences:function(){Script.tier["rocketFuel"] = 2;}};
	instance.techs["unlockBatteries"] = {available:false, done:false, unlocks:["unlockBatteriesT2"], consequences:function(){Script.tier["battery"] = 1;}};
	instance.techs["unlockBatteriesT2"] = {available:false, done:false, unlocks:["unlockBatteriesT3"], consequences:function(){Script.tier["battery"] = 2;}};
	instance.techs["unlockBatteriesT3"] = {available:false, done:false, unlocks:["unlockBatteriesT4"], consequences:function(){Script.tier["battery"] = 3;}};
	instance.techs["unlockBatteriesT4"] = {available:false, done:false, unlocks:[], consequences:function(){Script.tier["battery"] = 4;}};
	instance.techs["unlockPlasma"] = {available:false, done:false, unlocks:["unlockPlasmaTier2", "energyEfficiencyResearch"], consequences:function(){Script.data.producerColumn = "plasma"; Script.tier["plasma"] = 1;}};
	instance.techs["unlockPlasmaTier2"] = {available:false, done:false, unlocks:[], consequences:function(){Script.tier["plasma"] = 2;}};
	instance.techs["unlockEmc"] = {available:false, done:false, unlocks:["unlockMeteorite"], consequences:function(){}};
	instance.techs["unlockMeteorite"] = {available:false, done:false, unlocks:["unlockMeteoriteTier1"], consequences:function(){}};
	instance.techs["unlockMeteoriteTier1"] = {available:false, done:false, unlocks:["unlockMeteoriteTier2"], consequences:function(){Script.data.producerColumn = "meteorite"; Script.wonders.wonders["meteorite1"].available = true; Script.tier["meteorite"] = 1;}};
	instance.techs["unlockMeteoriteTier2"] = {available:false, done:false, unlocks:[], consequences:function(){Script.tier["meteorite"] = 2;}};
	instance.techs["unlockRocketFuelT3"] = {available:false, done:false, unlocks:[], consequences:function(){Script.tier["rocketFuel"] = 3;}};
	instance.techs["unlockLabT4"] = {available:false, done:false, unlocks:["scienceEfficiencyResearch"], consequences:function(){Script.labTier = 4;}};
	instance.techs["efficiencyResearch"] = {available:false, done:false, unlocks:[], consequences:function(){Script.science.techs["efficiencyResearch"].done = false; Script.goals.newTechs += 1;}};
	instance.techs["energyEfficiencyResearch"] = {available:false, done:false, unlocks:[], consequences:function(){Script.science.techs["energyEfficiencyResearch"].done = false; Script.goals.newTechs += 1;}};
	instance.techs["scienceEfficiencyResearch"] = {available:false, done:false, unlocks:[], consequences:function(){Script.science.techs["scienceEfficiencyResearch"].done = false; Script.goals.newTechs += 1;}};
	
	instance.labScore = function(building)
	{
		var result = {time:0, score:0, cost:{}, canBuild:true};
		for (key in building.cost)
		{
			var prod = getProduction(key);
			if (prod < 1) {prod = 1;}
			
			// Cost is cost per science unit
			var time = building.cost[key] / prod;
			if (time > result.time) {result.time = time;}
			result.cost[key] = building.cost[key] / building.prod;
			
			var score = building.prod / time;
			if (score > result.score) {result.score = score;}
			
			if (getResource(key) < building.cost[key] * 2) {result.canBuild = false;}
		}
		
		return result;
	};
	
	instance.update = function(self)
	{
		// Science Producers
		self.data[0] = {cost:{"metal":labMetalCost, "gem":labGemCost, "wood":labWoodCost}, prod:labOutput, cons:{}, mk:getLab};
		self.data[1] = {cost:{"metal":labT2MetalCost, "gem":labT2GemCost, "wood":labT2WoodCost}, prod:labT2Output, cons:{}, mk:getLabT2};
		self.data[2] = {cost:{"metal":labT3MetalCost, "gem":labT3GemCost, "wood":labT3WoodCost}, prod:labT3Output, cons:{}, mk:getLabT3};
		self.data[3] = {cost:{"metal":labT4MetalCost, "gem":labT4GemCost, "wood":labT4WoodCost}, prod:labT4Output, cons:{}, mk:getLabT4};
		
		self.maxScore = 0;
		for (id = 0; id < Script.labTier; id++)
		{
			var building = self.data[id];
			var result = self.labScore(building);
			self.score[id] = result;
			if (result.score > self.maxScore) {self.maxScore = result.score;}
		}
		
		for (id = 0; id < Script.labTier; id++)
		{
			var building = self.data[id];
			var result = self.score[id];
			
			var addition = 10;
			if (self.maxScore) {addition *= (result.score / self.maxScore);}
			for (key in building.cost) {Script.cost.addCost(Script.cost, key, addition * result.cost[key]);}
		}
		
		self.purchaseTech(self);
	}
	
	instance.build = function(self)
	{
		var maxScore = 0;
		var target = 0;
		for (id = 0; id < Script.labTier; id++)
		{
			var result = self.score[id];
			if (result.score > maxScore && result.canBuild) {maxScore = result.score; target = id;}
		}
		
		if (self.score[target].canBuild)
		{
			self.data[target].mk();
		}
	};
	
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
