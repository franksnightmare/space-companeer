console.log("Space Companeer: Loading Wonders");

Script.wonders = (function(){
	instance = {};
	
	instance.wonders = {};
	instance.wonders["precious1"] = {cost:{"gem":10000, "gold":7500, "silver":5000}, available:false, done:false, mk:achievePreciousWonder, unlocks:["precious2"], consequences:function(){}};
	instance.wonders["precious2"] = {cost:{"gem":30000, "gold":10000, "silver":20000}, available:false, done:false, mk:activatePreciousWonder, unlocks:[], consequences:function(){self.wonders["energetic1"].available = false;}};
	instance.wonders["energetic1"] = {cost:{"wood":10000, "charcoal":5000, "uranium":200}, available:false, done:false, mk:achievePreciousWonder, unlocks:["energetic2"], consequences:function(){}};
	instance.wonders["energetic2"] = {cost:{"wood":30000, "charcoal":15000, "uranium":500}, available:false, done:false, mk:activatePreciousWonder, unlocks:[], consequences:function(){}};
	
	instance.unlockWonder = function(self, wonders)
	{
		for (id in wonders)
		{
			for (key in self.wonders)
			{
				if (wonders[id] === key && !self.milestones[key].available)
				{
					self.milestones[key].available = true;
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
				for (resource in wonder.cost) {if (getResource(resource) < wonder.cost[key]) {canGo = false;}}
				
				if (canGo) {
					self.milestones[i].done = true;
					self.unlockWonder(self, wonder.unlocks);
					
					place.consequences();
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
