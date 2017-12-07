console.log("Space Companeer: Loading SPACE");

Script.space = (function(){
	instance = {};
	
	instance.milestones = {};
	instance.milestones["rocket"] = {requirements:{"metal":1200, "gem":900, "oil":1000}, available:true, done:false, unlocks:["launch"], consequences:function(){}};
	instance.milestones["launch"] = {requirements:{"fuel":20}, available:false, done:false, unlocks:["Moon", "Venus", "Mars", "AsteroidBelt"], consequences:function(){}};
	instance.milestones["Moon"] = {requirements:{"fuel":20}, available:false, done:false, unlocks:[], consequences:function(){Script.data.producerColumn = "lunarite";}};
	instance.milestones["Venus"] = {requirements:{"fuel":50}, available:false, done:false, unlocks:[], consequences:function(){Script.data.producerColumn = "methane";}};
	instance.milestones["Mars"] = {requirements:{"fuel":80}, available:false, done:false, unlocks:[], consequences:function(){Script.data.producerColumn = "silicon"; Script.energyTier = 3;}};
	instance.milestones["AsteroidBelt"] = {requirements:{"fuel":200}, available:false, done:false, unlocks:["WonderStation", "Jupiter", "Saturn", "Pluto", "KuiperBelt"], consequences:function(){Script.data.producerColumn = "silver"; Script.phase = 3;}};
	instance.milestones["WonderStation"] = {requirements:{"fuel":500}, available:false, done:false, unlocks:[], consequences:function(){Game.science.techs["efficiencyResearch"].available = true; Script.wonders.unlockWonderSet(Script.wonders, 1)}};
	instance.milestones["Jupiter"] = {requirements:{"fuel":1000}, available:false, done:false, unlocks:[], consequences:function(){}};
	instance.milestones["Saturn"] = {requirements:{"fuel":2000}, available:false, done:false, unlocks:[], consequences:function(){}};
	instance.milestones["Pluto"] = {requirements:{"fuel":5000}, available:false, done:false, unlocks:[], consequences:function(){}};
	instance.milestones["KuiperBelt"] = {requirements:{"fuel":6000}, available:false, done:false, unlocks:["SolCenter"], consequences:function(){}};
	instance.milestones["SolCenter"] = {requirements:{"fuel":7000}, available:false, done:false, unlocks:[], consequences:function(){Script.phase = 4;}};
	
	instance.unlockPlaces = function(self, places)
	{
		for (id in places)
		{
			for (key in self.milestones)
			{
				if (places[id] === key && !self.milestones[key].available)
				{
					self.milestones[key].available = true;
				}
			}
		}
	};
	
	instance.explorePlace = function(self)
	{
		for (key in self.milestones)
		{
			var place = self.milestones[key];
			if (place.available && !place.done)
			{
				var canGo = false;
				if (key === "rocket" && metal >= place.requirements["metal"] && gem >= place.requirements["gem"] && oil >= place.requirements["oil"]) {getRocket(); canGo = true;}
				else if (key === "launch" && fuel >= place.requirements["fuel"]) {launchRocket(); canGo = true;}
				else if (fuel >= place.requirements["fuel"]) {explore(key); canGo = true;}
				
				if (canGo) {
					self.milestones[key].done = true;
					self.unlockPlaces(self, place.unlocks);
					
					place.consequences();
				}
			}
		}
	};
	
	return instance;
}());
