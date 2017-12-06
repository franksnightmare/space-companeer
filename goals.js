console.log("Space Companeer: Loading Goal Automata");

Script.goals = (function(){
	instance = {};
	
	instance.nodes = {"energy":0, "science":0, "production":0};
	instance.modifiers = {"energy":0, "science":0, "production":1};
	instance.balance = {"energy":1/3, "science":1/3, "production":1/3};
	instance.newTechs = 2;
	instance.productionGoals = {"metal":0, "wood":0, "gem":0, "charcoal":0, "oil":0, "fuel":0};
	
	instance.updateProductionGoals = function(self)
	{
		var energyBuilding = Script.data.energyData[Script.decisions.energyFocus.id];
		for (key in energyBuilding.cost)
		{
			var prod = getProduction(key);
			if (prod < 1) {prod = 0.1;}
			self.productionGoals[key] += self.balance["energy"] * energyBuilding.cost[key] / (1000*prod);
		}
		for (key in energyBuilding.cons) {self.productionGoals[key] += self.balance["energy"] * energyBuilding.cons[key];}
		
		var labBuilding = Script.data.labData[Script.decisions.labFocus.id];
		for (key in labBuilding.cost) {
			var prod = getProduction(key);
			if (prod < 1) {prod = 0.1;}
			self.productionGoals[key] += self.balance["science"] * labBuilding.cost[key] / (1000*prod);
		}
		for (key in labBuilding.cons) {self.productionGoals[key] += self.balance["science"] * labBuilding.cons[key];}
		
		//if (Script.phase == 1) {self.productionGoals["gem"] += 0.2;}
		if (Script.phase == 2) {self.productionGoals["fuel"] += 0.1;}
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
		var highest = 0;
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
		return key;
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
