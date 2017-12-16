console.log("Space Companeer: Loading SPACE");

Script.space = (function(){
	instance = {};
	
	instance.milestones = {};
	instance.milestones["rocket"] = {requirements:{"metal":1200, "gem":900, "oil":1000}, available:true, done:false, unlocks:["launch"], consequences:function(){}};
	instance.milestones["launch"] = {requirements:{"rocketFuel":20}, available:false, done:false, unlocks:["Moon", "Venus", "Mars", "AsteroidBelt"], consequences:function(){}};
	instance.milestones["Moon"] = {requirements:{"rocketFuel":20}, available:false, done:false, unlocks:[], consequences:function(){Script.data.producerColumn = "lunarite";}};
	instance.milestones["Venus"] = {requirements:{"rocketFuel":50}, available:false, done:false, unlocks:[], consequences:function(){Script.data.producerColumn = "methane";}};
	instance.milestones["Mars"] = {requirements:{"rocketFuel":80}, available:false, done:false, unlocks:[], consequences:function(){Script.data.producerColumn = "silicon"; Script.energyTier = 3;}};
	instance.milestones["AsteroidBelt"] = {requirements:{"rocketFuel":200}, available:false, done:false, unlocks:["WonderStation", "Jupiter", "Saturn", "Pluto", "KuiperBelt"], consequences:function(){Script.data.producerColumn = "silver"; Script.phase = 4;}};
	instance.milestones["WonderStation"] = {requirements:{"rocketFuel":500}, available:false, done:false, unlocks:[], consequences:function(){Script.science.techs["efficiencyResearch"].available = true; Script.wonders.unlockWonderSet(Script.wonders, 1)}};
	instance.milestones["Jupiter"] = {requirements:{"rocketFuel":1000}, available:false, done:false, unlocks:[], consequences:function(){Script.data.producerColumn = "hydrogen";}};
	instance.milestones["Saturn"] = {requirements:{"rocketFuel":2000}, available:false, done:false, unlocks:[], consequences:function(){Script.data.producerColumn = "helium"; Script.energyTier = 6;}};
	instance.milestones["Pluto"] = {requirements:{"rocketFuel":5000}, available:false, done:false, unlocks:[], consequences:function(){Script.data.producerColumn = "ice";}};
	instance.milestones["KuiperBelt"] = {requirements:{"rocketFuel":6000}, available:false, done:false, unlocks:["SolCenter"], consequences:function(){}};
	instance.milestones["SolCenter"] = {requirements:{"rocketFuel":7000}, available:false, done:false, unlocks:[], consequences:function(){Script.phase = 5;}};
	
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
				else if (key === "launch" && getResource("rocketFuel") >= place.requirements["rocketFuel"]) {launchRocket(); canGo = true;}
				else if (getResource("rocketFuel") >= place.requirements["rocketFuel"]) {explore(key); canGo = true;}
				
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
