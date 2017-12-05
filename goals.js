console.log("Space Companeer: Loading Goal Automata");

Script.goals = (function(){
	instance = {};
	
	instance.nodes = {"energy":0, "science":0, "production":0};
	instance.modifiers = {"energy":0, "science":0, "production":1};
	instance.balance = {"energy":1/3, "science":1/3, "production":1/3};
	instance.newTechs = 2;
	instance.productionGoals = {"metal":0, "wood":0, "gem":0, "charcoal":0, "oil":0, "fuel":0};
	
	instance.updateProductionGoals = function()
	{
		var energyBuilding = Script.data.energyData[Script.decisions.energyFocus.id];
		for (key in energyBuilding.cost) {instance.productionGoals[key] += instance.balance["energy"] * enenergyBuilding.cost[key];}
		for (key in energyBuilding.cons) {instance.productionGoals[key] += instance.balance["energy"] * enenergyBuilding.cons[key];}
		
		var labBuilding = Script.data.labData[Script.decisions.labFocus.id];
		for (key in labBuilding.cost) {instance.productionGoals[key] += instance.balance["science"] * labBuilding.cost[key];}
		for (key in labBuilding.cons) {instance.productionGoals[key] += instance.balance["science"] * labBuilding.cons[key];}
		
		if (phase == 1) {instance.productionGoal["metal"] += 0.2; instance.productionGoal["gem"] += 0.2;}
		if (phase == 2) {instance.productionGoals["fuel"] += 0.1;}
	};
	
	instance.diminishNode = function(key, amount)
	{
		var strength = instance.nodes[key];
		
		if (strength < amount) {strength = 0;}
		else {strength -= amount;}
		
		instance.nodes[key] = strength;
	};
	
	instance.boostNode = function(key, amount)
	{
		instance.nodes[key] += instance.modifiers[key] * amount;
	};
	
	instance.updateNode = function(key)
	{
		instance.nodes[key] *= 0.9;
	};
	
	instance.sumNodes = function()
	{
		var total = 0;
		for (key in instance.nodes)
		{
			total += instance.nodes[key];
		}
		return total;
	};
	
	instance.highestGoal = function()
	{
		var highest = 0;
		var label = "null";
		for (key in instance.balance)
		{
			var score = instance.balance[key];
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
		
		if (energy < 1) {self.boostNode("energy", maxEnergy);}
		else {self.boostNode("energy", (10/3) * (maxEnergy / energy));}
		
		self.boostNode("science", self.newTechs / (self.newTechs + 1));
		self.boostNode("production", 1);
		
		self.diminishNode("production", 0.05 * self.nodes["energy"]);
		self.diminishNode("production", 0.05 * self.nodes["science"]);
		self.diminishNode("science", 0.05 * self.nodes["energy"]);
		
		self.updateNode("energy");
		self.updateNode("science");
		self.updateNode("production");
		
		var total = self.sumNodes();
		for (key in self.balance)
		{
			self.balance[key] = self.nodes[key] / total;
		}
	};
	
	instance.print = function(self)
	{
		console.log("(" + self.balance["energy"] + ", " + self.balance["science"] + ", " + self.balance["production"] + ")");
	};
	
	return instance;
}());
