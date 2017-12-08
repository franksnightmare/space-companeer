console.log("Space Companeer: Loading Goal Automata");

Script.goals = (function(){
	instance = {};
	
	instance.nodes = {"energy":100, "science":0, "production":0};
	instance.modifiers = {"energy":0, "science":0, "production":1};
	instance.balance = {"energy":1/3, "science":1/3, "production":1/3};
	instance.newTechs = 2;
	instance.productionGoals = {"metal":0, "wood":0, "gem":0, "charcoal":0, "oil":0, "rocketFuel":0, "lunarite":0, "methane":0, "titanium":0, "silicon":0, "gold":0, "silver":0};
	
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
	
	instance.diminishNode = function(self, key, amount)
	{
		var strength = self.nodes[key];
		
		if (strength < amount) {strength = 0;}
		else {strength -= amount;}
		
		self.nodes[key] = strength;
	};
	
	instance.boostNode = function(self, key, amount)
	{
		self.nodes[key] += self.modifiers[key] * amount;
	};
	
	instance.updateNode = function(self, key)
	{
		self.nodes[key] *= 0.9;
	};
	
	instance.sumNodes = function(self)
	{
		var total = 0;
		for (key in self.nodes)
		{
			total += self.nodes[key];
		}
		return total;
	};
	
	instance.highestGoal = function(self)
	{
		var highest = -1;
		var label = "null";
		for (key in self.balance)
		{
			var score = self.balance[key];
			if (score > highest)
			{
				highest = score;
				label = key;
			}
		}
		return label;
	};
	
	instance.update = function(self)
	{
		var energy = getProduction("energy");
		var maxEnergy = Script.data.maxEnergy;
		
		if (energy < 1) {self.boostNode(self, "energy", maxEnergy);}
		else {self.boostNode(self, "energy", (10/3) * (maxEnergy / energy));}
		
		self.boostNode(self, "science", self.newTechs / (self.newTechs + 1));
		self.boostNode(self, "production", 1);
		
		//console.log("ESP Nodes: (" + self.nodes["energy"] + ", " + self.nodes["science"] + ", " + self.nodes["production"] + ")");
		
		self.diminishNode(self, "production", 0.05 * self.nodes["energy"]);
		self.diminishNode(self, "production", 0.05 * self.nodes["science"]);
		self.diminishNode(self, "science", 0.05 * self.nodes["energy"]);
		
		self.updateNode(self, "energy");
		self.updateNode(self, "science");
		self.updateNode(self, "production");
		
		var total = self.sumNodes(self);
		for (key in self.balance)
		{
			self.balance[key] = self.nodes[key] / total;
		}
	};
	
	instance.print = function(self)
	{
		console.log("ESP Balance: (" + self.balance["energy"] + ", " + self.balance["science"] + ", " + self.balance["production"] + ")");
	};
	
	return instance;
}());
