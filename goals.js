console.log("Space Companeer: Loading Goal Automata");

Script.goals = (function(){
	instance = {};
	
	instance.newTechs = 2;
	
	/*
	instance.updateProductionGoals = function(self)
	{
		if (self.balance.energy != 0)
		{
			for (i = 0; i < Script.energyTier; i++)
			{
				var mod = 0.1;
				if (i == Script.decisions.energyFocus.id) {mod = 1 - 0.1 * (Script.energyTier - 1);}
				var energyBuilding = Script.data.energyData[i];
				for (key in energyBuilding.cost)
				{
					var prod = getProduction(key);
					if (prod < 1) {prod = 0.1;}
					self.productionGoals[key] += mod * energyBuilding.cost[key] / (100*prod);
				}
				for (key in energyBuilding.cons) {self.productionGoals[key] += mod * energyBuilding.cons[key];}
			}
		}
		
		var labBuilding = Script.data.labData[Script.decisions.labFocus.id];
		for (key in labBuilding.cost) {
			var prod = getProduction(key);
			if (prod < 1) {prod = 0.1;}
			self.productionGoals[key] += 0.1 * self.balance["science"] * labBuilding.cost[key] / (100*prod);
		}
		
		if (Script.phase == 1) {self.productionGoals["gem"] += 0.2;}
		if (Script.phase == 2) {self.productionGoals["gem"] += 0.4; if (getProduction("rocketFuel") < 1) {self.productionGoals["rocketFuel"] += 1;}}
		if (Script.phase == 3) {self.productionGoals["lunarite"] += 0.5; self.productionGoals["titanium"] += 0.5; if (getProduction("rocketFuel") < 5) {self.productionGoals["rocketFuel"] += 1;}}
	};
	*/
	
	instance.setGoals = function(self)
	{
		if (Script.cost.total) {for (key in Script.data.producerData) {Script.cost.balance[key] = Script.cost[key] / Script.cost.total;}}
		
		for (key in Script.data.producerData)
		{
			self[key] = {amount:0, type:"null"};
			
			var request = Script.cons[key];
			if (request > self[key].amount) {self[key].amount = request; self[key].type = "cons";}
			
			if (Script.cost.counter[key])
			{
				request = Script.data.maxProd * Script.cost[key] / Script.total;
				if (request > self[key].amount) {self[key].amount = request; self[key].type = "cost";}
			}
		}
	};
	
	instance.build = function()
	{
		Script.energy.build(Script.energy);
		Script.data.build(Script.data);
		Script.science.build(Script.science);
	};
	
	return instance;
}());
