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
		//console.log(self.total + ", " + key + ", " + amount);
		self[key] += amount;
		self.total += amount;
		self.counter[key] += 1;
	};
	
	instance.addCons = function(self)
	{
		for (target in Script.data.producerData)
		{
			var cons = Script.cons[target];
			if (cons)
			{
				var group = Script.data.producerData[target];
				var scores = Script.data.producerScore[target];
				for (id = 0; id < Script.machineTier; id++)
				{
					if (target in Script.tier && id == Script.tier[target]) {break;}
					
					for (key in scores.result[id].cost)
					{
						var addition = cons / Script.cons.max;
						if (scores.maxScore) {addition *= (scores.result[id].score / scores.maxScore);}
						addition *= scores.result[id].cost[key];
						self.addCost(self, key, addition);
					}
				}
			}
		}
		
		if (self.counter["metal"] && self.counter["lunarite"])
		{
			var c1 = self.counter["metal"];
			var c2 = self.counter["lunarite"];
			if (self["metal"] / c1 < self["lunarite"] / c2)
			{
				self.addCost(self, "metal", self["lunarite"]);
				self.counter["metal"] = 1;
			}
		}
	};
	
	instance.itterate = function(self)
	{
		if (self.total) {for (key in Script.data.producerData) {self.balance[key] = self[key] / self.total;}}
		
		for (target in Script.data.producerData)
		{
			if (self.counter[target])
			{
				var group = Script.data.producerData[target];
				var scores = Script.data.producerScore[target];
				for (id = 0; id < Script.machineTier; id++)
				{
					if (target in Script.tier && id == Script.tier[target]) {break;}
					
					for (key in scores.result[id].cost)
					{
						var addition = self.balance[target];
						if (scores.maxScore) {addition *= (scores.result[id].score / scores.maxScore);}
						addition *= scores.result[id].cost[key];
						self.addCost(self, key, addition);
					}
				}
			}
		}
	}
	
	return instance;
}());
