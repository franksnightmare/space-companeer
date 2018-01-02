console.log("Space Companeer: Loading Wonders");

Script.wonders = (function(){
	instance = {};
	
	instance.wonders = {};
	instance.wonders["precious1"] = {cost:{"gem":10000, "gold":5000, "silver":7500}, available:true, done:false, mk:achievePreciousWonder, unlocks:["precious2"], consequences:function(){}, skip:function(){return Game.statistics.entries.wondersBuilt.value >= 3;}};
	instance.wonders["precious2"] = {cost:{"gem":30000, "gold":10000, "silver":20000}, available:false, done:false, mk:activatePreciousWonder, unlocks:[], consequences:function(){Script.wonders.wonders["energetic1"].available = true; Script.data.unlockResource(Script.data, "uranium"); Script.energyTier = 5;}, skip:function(){return Game.statistics.entries.wondersActivated.value >= 3;}};
	instance.wonders["energetic1"] = {cost:{"wood":10000, "charcoal":5000, "uranium":200}, available:false, done:false, mk:achieveEnergeticWonder, unlocks:["energetic2"], consequences:function(){}, skip:function(){return Game.statistics.entries.wondersBuilt.value >= 3;}};
	instance.wonders["energetic2"] = {cost:{"wood":30000, "charcoal":15000, "uranium":500}, available:false, done:false, mk:activateEnergeticWonder, unlocks:[], consequences:function(){Script.data.unlockResource(Script.data, "lava"); Script.energyTier = 6;}, skip:function(){return Game.statistics.entries.wondersActivated.value >= 3;}};
	instance.wonders["tech1"] = {cost:{"gem":40000, "silicon":30000, "gold":18000}, available:true, done:false, mk:achieveTechWonder, unlocks:["tech2"], consequences:function(){}, skip:function(){return Game.statistics.entries.wondersBuilt.value >= 3;}};
	instance.wonders["tech2"] = {cost:{"gem":60000, "silicon":50000, "gold":30000}, available:false, done:false, mk:activateTechWonder, unlocks:[], consequences:function(){Script.machineTier = 3;}, skip:function(){return Game.statistics.entries.wondersActivated.value >= 3;}};
	instance.wonders["plasma"] = {cost:{"hydrogen":1500, "uranium":1500, "oil":15000, "wood":15000}, available:false, done:false, mk:unlockPlasmaResearch, unlocks:[], consequences:function(){Script.science.techs["unlockPlasma"].available = true;}, skip:function(){return Game.tech.isPurchased("unlockPlasma");}};
	instance.wonders["emc"] = {cost:{"energy":75000, "plasma":100}, available:false, done:false, mk:unlockEmcResearch, unlocks:[], consequences:function(){Script.science.techs["unlockEmc"].available = true;}, skip:function(){return Game.tech.isPurchased("unlockEmc");}};
	instance.wonders["dyson"] = {cost:{"energy":100000, "plasma":100000}, available:false, done:false, mk:unlockEmcResearch, unlocks:[], consequences:function(){Script.science.techs["unlockDyson"].available = true;}, skip:function(){return Game.tech.isPurchased("unlockDyson");}};
	instance.wonders["meteorite1"] = {cost:{"meteorite":5000, "ice":600000, "silicon":1200000}, available:false, done:false, mk:achieveMeteoriteWonder, unlocks:["meteorite2"], consequences:function(){}, skip:function(){return Game.statistics.entries.wondersBuilt.value >= 4;}};
	instance.wonders["meteorite2"] = {cost:{"meteorite":10000, "ice":2000000, "silicon":4000000}, available:false, done:false, mk:activateMeteoriteWonder, unlocks:[], consequences:function(){Script.machineTier = 4;}, skip:function(){return Game.statistics.entries.wondersActivated.value >= 4;}};
	
	instance.update = function(self)
	{
		self.getWonder(self);
		
		for (id in self.wonders)
		{
			var wonder = self.wonders[id]
			if (wonder.available && !wonder.done)
			{
				for (key in wonder.cost)
				{
					var mult = 1;
					var amount = wonder.cost[key] / (50 * (1 + Math.log10(wonder.cost[key]) * 4));
					
					if (key === "plasma") {mult /= 4;}
					if (key === "meteorite") {mult /= 16;}
					if (key !== "energy")
					{
						Script.cons.addCons(Script.cons, key, Math.ceil(amount * mult));
					}
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
		var counter = 0;
		for (key in self.wonders)
		{
			var wonder = self.wonders[key];
			if (wonder.available && !wonder.done)
			{
				var canGo = true;
				for (resource in wonder.cost) {if (getResource(resource) < wonder.cost[resource]) {canGo = false;}}
				if (wonder.skip()) {canGo = true;}
				
				if (canGo) {
					if (!wonder.skip()) {wonder.mk();}
					
					self.wonders[key].done = true;
					self.unlockWonder(self, wonder.unlocks);
					
					wonder.consequences();
				}
			}
			counter += 1;
		}
	};
	
	return instance;
}());
