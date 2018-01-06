console.log("Space Companeer: Loading Energy Handler");

Script.energy = (function(){
	instance = {};
	
	instance.energyPriority = 0;
	instance.max = 0;
	instance.maxScore = 0;
	instance.data = {};
	instance.score = {};
	
	instance.init = function(self)
	{
		// Energy Producers
		self.data["engine"] = {unlocked:false, cost:{"metal":charcoalEngineMetalCost, "gem":charcoalEngineGemCost}, prod:charcoalEngineOutput, cons:{"charcoal":charcoalEngineCharcoalInput}, mk:getCharcoalEngine};
		self.data["solar"] = {unlocked:false, cost:{"metal":solarPanelMetalCost, "gem":solarPanelGemCost}, prod:solarPanelOutput, cons:{}, mk:getSolarPanel};
		self.data["methane"] = {unlocked:false, cost:{"lunarite":methaneStationLunariteCost, "titanium":methaneStationTitaniumCost}, prod:methaneStationOutput, cons:{"methane":methaneStationMethaneInput}, mk:getMethaneStation};
		self.data["nuclear"] = {unlocked:false, cost:{"lunarite":nuclearStationLunariteCost, "titanium":nuclearStationTitaniumCost}, prod:nuclearStationOutput, cons:{"uranium":nuclearStationUraniumInput}, mk:getNuclearStation};
		self.data["magmatic"] = {unlocked:false, cost:{"lunarite":magmaticLunariteCost, "gem":magmaticGemCost, "silver":magmaticSilverCost}, prod:magmaticOutput, cons:{"lava":magmaticLavaInput}, mk:getMagmatic};
		self.data["fusion"] = {unlocked:false, cost:{"lunarite":fusionReactorLunariteCost, "titanium":fusionReactorTitaniumCost, "silicon":fusionReactorSiliconCost}, prod:fusionReactorOutput, cons:{"hydrogen":fusionReactorHydrogenInput, "helium":fusionReactorHeliumInput}, mk:getFusionReactor};
		
		self.score["engine"] = {};
		self.score["solar"] = {};
		self.score["methane"] = {};
		self.score["nuclear"] = {};
		self.score["magmatic"] = {};
		self.score["fusion"] = {};
	};
	
	instance.energyScore = function(building)
	{
		var result = {time:0, realTime:0, score:0, cost:{}, canBuild:true};
		for (key in building.cost)
		{
			var prod = getProduction(key);
			if (prod < 1) {prod = 1;}
			
			// Cost is cost per energy unit
			var time = building.cost[key] / prod;
			var realTime = (building.cost[key] - getResource(key)) / prod;
			if (realTime <= 0) {realTime = 0;}
			if (realTime > result.realTime) {result.realTime = realTime;}
			if (time > result.time) {result.time = time;}
			result.cost[key] = building.cost[key] / building.prod;
			
			var score = building.prod / Math.pow(time, 1.5);
			if (score < result.score || result.score == 0) {result.score = score;}
			
			if (getStorage(key) < building.cost[key]) {result.canBuild = false;}
		}
		for (key in building.cons)
		{
			var drain = building.cons[key] / 1000 + result.time / 2400;
			// if (getProduction(key) < building.cons[key] * (1.1 + 1.4 * Math.pow(2, -drain))) {result.canBuild = false;}
			if (getProduction(key) < building.cons[key] * (1.1 + 0.7 * Math.pow(2, -drain))) {result.canBuild = false;}
		}
		
		return result;
	};
	
	instance.build = function(self)
	{
		if (Game.tech.isUnlocked("unlockDyson") && Game.statistics.entries.wondersActivated.value >= 4) {self.dyson.build(self.dyson);}
		
		var highest = 0;
		var highId = "null";
		for (id in self.data)
		{
			if (self.data[id].unlocked)
			{
				var result = self.score[id];
				if (result.score > highest && result.canBuild) {highest = result.score; highId = id;}
			}
		}
		if (highId in self.score)
		{
			if (self.score[highId].canBuild)
			{
				if (self.score[highId].realTime < self.score[highId].time / 3 && self.score["methane"].unlocked = true)
				{
					Script.goals.lockEverything(Script.goals);
					Script.goals.lock["energy"] = false;
					Script.goals.lock["storage"] = false;
					console.log("Rushing energy building: " + highId);
				}
				self.data[highId].mk();
			}
		}
	};
	
	instance.update = function(self)
	{
		// Energy Producers
		self.data["engine"] = {unlocked:Script.energy.data["engine"].unlocked, cost:{"metal":charcoalEngineMetalCost, "gem":charcoalEngineGemCost}, prod:charcoalEngineOutput, cons:{"charcoal":charcoalEngineCharcoalInput}, mk:getCharcoalEngine};
		self.data["solar"] = {unlocked:Script.energy.data["solar"].unlocked, cost:{"metal":solarPanelMetalCost, "gem":solarPanelGemCost}, prod:solarPanelOutput, cons:{}, mk:getSolarPanel};
		self.data["methane"] = {unlocked:Script.energy.data["methane"].unlocked, cost:{"lunarite":methaneStationLunariteCost, "titanium":methaneStationTitaniumCost}, prod:methaneStationOutput, cons:{"methane":methaneStationMethaneInput}, mk:getMethaneStation};
		self.data["nuclear"] = {unlocked:Script.energy.data["nuclear"].unlocked, cost:{"lunarite":nuclearStationLunariteCost, "titanium":nuclearStationTitaniumCost}, prod:nuclearStationOutput, cons:{"uranium":nuclearStationUraniumInput}, mk:getNuclearStation};
		self.data["magmatic"] = {unlocked:Script.energy.data["magmatic"].unlocked, cost:{"lunarite":magmaticLunariteCost, "gem":magmaticGemCost, "silver":magmaticSilverCost}, prod:magmaticOutput, cons:{"lava":magmaticLavaInput}, mk:getMagmatic};
		self.data["fusion"] = {unlocked:Script.energy.data["fusion"].unlocked, cost:{"lunarite":fusionReactorLunariteCost, "titanium":fusionReactorTitaniumCost, "silicon":fusionReactorSiliconCost}, prod:fusionReactorOutput, cons:{"hydrogen":fusionReactorHydrogenInput, "helium":fusionReactorHeliumInput}, mk:getFusionReactor};
		
		self.maxScore = 0;
		for (id in self.data)
		{
			if (self.data[id].unlocked)
			{
				var building = self.data[id];
				var result = self.energyScore(building);
				self.score[id] = result;
				if (result.score > self.maxScore) {self.maxScore = result.score;}
			}
		}
		
		for (id in self.data)
		{
			if (self.data[id].unlocked)
			{
				var building = self.data[id];
				var result = self.score[id];
				
				var addition = self.energyPriority;
				if (self.maxScore) {addition *= (result.score / self.maxScore);}
				for (key in building.cons)
				{
					Script.cons.addCons(Script.cons, key, building.cons[key] * 4);
					var maxScore = Script.data.producerScore[key].maxScore;
					if (maxScore)
					{
						for (var id2 = 0; id2 < Script.machineTier; id2++)
						{
							if (key in Script.tier && id2 == Script.tier[key]) {break;}
							
							var producer = Script.data.producerData[key][id2];
							var score = Script.data.producerScore[key].result[id2].score;
							var mult = addition * score / maxScore;
							for (key2 in producer.cost) {Script.cost.addCost(Script.cost, key2, mult * producer.cost[key2]);}
						}
					}
				}
				for (key in building.cost) {Script.cost.addCost(Script.cost, key, addition * building.cost[key]);}
			}
		}
		
		var production = getProduction("energy");
		if (production > 0) {
			self.energyPriority = 4 * self.max / (4 * self.max + production);
		}
		else {self.energyPriority = 1;}
	};
	
	return instance;
}());
