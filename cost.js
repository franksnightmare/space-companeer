console.log("Space Companeer: Loading Cost Handler");

Script.cost = (function(){
	instance = {};
	instance.total = 0;
	instance.counter = {};
	instance.balance = {};
	
	instance.resetCost = function(self)
	{
		self.total = 0;
		for (key in Script.data.producerData) {self[key] = 0; self.balance[key] = 0; self.counter[key] = 0;}
	};
	
	instance.addCost = function(self, key, amount)
	{
		self[key] += amount;
		self.total += amount;
		self.counter[key] += 1;
	};
	
	instance.itterate = function(self)
	{
		for (key in Script.data.producerData) {self.balance[key] = self[key] / total;}
		
		for (target in Script.data.producerData)
		{
			if (self.counter[target])
			{
				var group = Script.data.producerData[target];
				var scores = Script.data.producerScore[target];
				for (id in group)
				{
					for (key in scores.result[id].cost)
					{
						self.addCost(self, key, self.balance[target] * (scores.result[id].score / scores.maxScore) * scores.result[id].cost[key]);
					}
					
					if (target === "rocketFuel") {if (id >= Script.fuelTier) {break;}}
					else {if (id >= Script.machineTier) {break;}}
				}
			}
		}
		// TODO, add resource thing and loop over all producing buildings, add to cost
	}
	
	return instance;
}());
