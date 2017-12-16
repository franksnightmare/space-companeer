console.log("Space Companeer: Loading Energy Handler");

Script.energy = (function(){
	instance = {};
	
	instance.energyPriority = 0;
	instance.max = 0;
	instance.maxScore = 0;
	instance.data = [{}, {}, {}, {}, {}, {}];
	instance.score = [{}, {}, {}, {}, {}, {}];
	
	instance.energyScore = function(building)
	{
		var result = {time:0, score:0, cost:{}, canBuild:true};
		for (key in building.cost)
		{
			var prod = getProduction(key);
			if (prod < 1) {prod = 1;}
			
			// Cost is cost per energy unit
			var time = building.cost[key] / prod;
			if (time > result.time) {result.time = time;}
			result.cost[key] = building.cost[key] / building.prod;
			
			var score = building.prod / time;
			if (score > result.score) {result.score = score;}
		}
		for (key in building.cons) {if (getProduction(key) < 2 * building.cons[key]) {result.canBuild = false;}}
		
		return result;
	};
	
	instance.build = function(self)
	{
		var highest = 0;
		var highId = 0;
		for (id = 0; id < Script.energyTier; id++)
		{
			var result = self.score[id];
			if (result.score > highest && result.canBuild) {highest = result.score; highId = id;}
		}
		if (self.score[highId].canBuild)
		{
			self.data[highId].mk();
		}
	};
	
	instance.update = function(self)
	{
		// Energy Producers
		self.data[0] = {cost:{"metal":charcoalEngineMetalCost, "gem":charcoalEngineGemCost}, prod:charcoalEngineOutput, cons:{"charcoal":charcoalEngineCharcoalInput}, mk:getCharcoalEngine};
		self.data[1] = {cost:{"metal":solarPanelMetalCost, "gem":solarPanelGemCost}, prod:solarPanelOutput, cons:{}, mk:getSolarPanel};
		self.data[2] = {cost:{"lunarite":methaneStationLunariteCost, "titanium":methaneStationTitaniumCost}, prod:methaneStationOutput, cons:{"methane":methaneStationMethaneInput}, mk:getMethaneStation};
		self.data[3] = {cost:{"lunarite":nuclearStationLunariteCost, "titanium":nuclearStationTitaniumCost}, prod:nuclearStationOutput, cons:{"methane":nuclearStationUraniumInput}, mk:getNuclearStation};
		self.data[4] = {cost:{"lunarite":magmaticLunariteCost, "gem":magmaticGemCost, "silver":magmaticSilverCost}, prod:magmaticOutput, cons:{"lava":magmaticLavaInput}, mk:getMagmatic};
		self.data[5] = {cost:{"lunarite":fusionReactorLunariteCost, "titanium":fusionReactorTitaniumCost, "silicon":fusionReactorSiliconCost}, prod:fusionReactorOutput, cons:{"hydrogen":fusionReactorHydrogenInput, "helium":fusionReactorHeliumInput}, mk:getFusionReactor};
		
		self.maxScore = 0;
		for (id = 0; id < Script.energyTier; id++)
		{
			var building = self.data[id];
			var result = self.energyScore(building);
			self.score[id] = result;
			if (result.score > self.maxScore) {self.maxScore = result.score;}
		}
		
		for (id = 0; id < Script.energyTier; id++)
		{
			var building = self.data[id];
			var result = self.score[id];
			
			for (key in building.cons) {Script.cons.addCons(Script.cons, key, building.cons[key] * 4);}
			var addition = self.energyPriority * self.max;
			if (self.maxScore) {addition *= (result.score / self.maxScore);}
			for (key in building.cost) {Script.cost.addCost(Script.cost, key, addition * building.cost[key]);}
		}
	};
	
	return instance;
}());
