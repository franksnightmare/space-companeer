console.log("Space Companeer: Loading Wonders");

Script.wonders = (function(){
	instance = {};
	
	instance.wonders = {};
	instance.wonders["precious1"] = {cost:{"gem":10000, "gold":5000, "silver":7500}, available:false, done:false, mk:achievePreciousWonder, unlocks:["precious2"], consequences:function(){}};
	instance.wonders["precious2"] = {cost:{"gem":30000, "gold":10000, "silver":20000}, available:false, done:false, mk:activatePreciousWonder, unlocks:[], consequences:function(){Script.wonders.wonders["energetic1"].available = true; Script.data.producerColumn = "uranium"; Script.energyTier = 5;}};
	instance.wonders["energetic1"] = {cost:{"wood":10000, "charcoal":5000, "uranium":200}, available:false, done:false, mk:achieveEnergeticWonder, unlocks:["energetic2"], consequences:function(){}};
	instance.wonders["energetic2"] = {cost:{"wood":30000, "charcoal":15000, "uranium":500}, available:false, done:false, mk:activateEnergeticWonder, unlocks:[], consequences:function(){Script.data.producerColumn = "lava"; Script.energyTier = 6;}};
	instance.wonders["tech1"] = {cost:{"gem":40000, "silicon":30000, "gold":18000}, available:true, done:false, mk:achieveTechWonder, unlocks:["tech2"], consequences:function(){}};
	instance.wonders["tech2"] = {cost:{"gem":60000, "silicon":50000, "gold":30000}, available:false, done:false, mk:activateTechWonder, unlocks:[], consequences:function(){Script.machineTier = 3;}};
	
	instance.update = function(self)
	{
		self.getWonder(self);
		
		for (id in self.wonders)
		{
			var wonder = self.wonders[id]
			if (wonder.available)
			{
				for (key in wonder.cost)
				{
					Script.cons.addCons(Script.cons, key, wonder.cost[key] / (100 * (1 + Math.log10(wonder.cost[key] / 2))));
				}
			}
		}
	};
	
	instance.unlockWonder = function(self, wonders)
	{
		for (id in wonders)
		{
			for (key in self.wonders)
			{
				if (wonders[id] === key && !self.wonders[key].available)
				{
					self.wonders[key].available = true;
				}
			}
		}
	};
	
	instance.getWonder = function(self)
	{
		for (key in self.wonders)
		{
			var wonder = self.wonders[key];
			if (wonder.available && !wonder.done)
			{
				var canGo = true;
				for (resource in wonder.cost) {if (getResource(resource) < wonder.cost[resource]) {canGo = false;}}
				
				if (canGo) {
					wonder.mk();
					
					self.wonders[key].done = true;
					self.unlockWonder(self, wonder.unlocks);
					
					wonder.consequences();
				}
			}
		}
	};
	
	instance.unlockWonderSet = function(self, num)
	{
		if (num == 1)
		{
			self.wonders["precious1"].available = true;
		}
	};
	
	return instance;
}());
