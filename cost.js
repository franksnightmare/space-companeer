console.log("Space Companeer: Loading Cost Handler");

Script.cost = (function(){
	instance = {};
	instance.total = 0;
	instance.counter = {};
	instance.balance = {};
	
	instance.resetCost = function(self)
	{
		self.total = 0;
		for (key in Script.data.producerData) {self[key] = 0; console.log(self[key]); self.balance[key] = 0; self.counter[key] = 0;}
	};
	
	instance.addCost = function(self, key, amount)
	{
		self[key] += amount;
		self.total += amount;
		self.counter[key] += 1;
	};
	
	instance.addCons = function(self)
	{
		for (key in Script.data.producerData)
		{
			var cons = Script.cons[key];
			if (cons)
			{
				self.addCost(self, key, cons);
			}
			
			if (key === Script.data.producerColumn) {break;}
		}
	};
	
	instance.itterate = function(self)
	{
		console.log("Total: " + self.total);
		if (self.total) {for (key in Script.data.producerData) {self.balance[key] = self[key] / self.total;}}
		
		for (target in Script.data.producerData)
		{
			if (self.counter[target])
			{
				var group = Script.data.producerData[target];
				var scores = Script.data.producerScore[target];
				for (id = 0; id < Script.machineTier; id++)
				{
					if (target === "rocketFuel" && id == Script.fuelTier) {break;}
					
					for (key in scores.result[id].cost)
					{
						var addition = 0;
						addition = self.balance[target];
						if (scores.maxScore) {addition *= (scores.result[id].score / scores.maxScore);}
						addition *= scores.result[id].cost[key];
						self.addCost(self, key, addition);
					}
				}
			}
		}
		// TODO, add resource thing and loop over all producing buildings, add to cost
	}
	
	return instance;
}());
