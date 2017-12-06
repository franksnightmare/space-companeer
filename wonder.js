console.log("Space Companeer: Loading Wonders");

Script.wonders = (function(){
	instance = {};
	
	instance.wonders = {};
	instance.wonders["precious1"] = {cost:{"gem":10000, "gold":7500, "silver":5000}, available:false, done:false, mk:achievePreciousWonder, unlocks:["precious2"], consequences:function(){}};
	instance.wonders["precious2"] = {cost:{"gem":30000, "gold":10000, "silver":20000}, available:false, done:false, mk:activatePreciousWonder, unlocks:[], consequences:function(){self.wonders["energetic1"].available = false;}};
	instance.wonders["energetic1"] = {cost:{"wood":10000, "charcoal":5000, "uranium":200}, available:false, done:false, mk:achievePreciousWonder, unlocks:["energetic2"], consequences:function(){}};
	instance.wonders["energetic2"] = {cost:{"wood":30000, "charcoal":15000, "uranium":500}, available:false, done:false, mk:activatePreciousWonder, unlocks:[], consequences:function(){}};
	
	instance.unlockPlaces = function(self, places)
	{
		for (i = 0; i < places.length; i++)
		{
			for (j = 0; j < self.milestones.length; j++)
			{
				if (places[i] === self.milestones[j].name && !self.milestones[j].available)
				{
					self.milestones[j].available = true;
				}
			}
		}
	};
	
	instance.getAmount(resource)
	{
		if (resource === "gem") {return gem;}
		if (resource === "gold") {return gold;}
		if (resource === "silver") {return silver;}
		if (resource === "wood") {return wood;}
		if (resource === "charcoal") {return charcoal;}
		if (resource === "uranium") {return uranium;}
		return 0;
	};
	
	instance.getWonder = function(self)
	{
		for (key in self.wonders)
		{
			var wonder = self.wonders[key];
			if (wonder.available && !wonder.done)
			{
				var canGo = true;
				for (resource in wonder.cost) {if (self.getAmount(resource) < wonder.cost[key]) {canGo = false;}}
				
				if (canGo) {
					self.milestones[i].done = true;
					self.unlockPlaces(self, place.unlocks);
					
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
