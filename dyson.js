console.log("Space Companeer: Loading Dyson Handler");

Script.energy.dyson = (function(){
	instance = {};
	
	instance.maxScore = 0;
	instance.target = -1;
	instance.data = [{}, {}, {}];
	instance.score = [{}, {}, {}];
	
	instance.getScore = function(self, dysonPart)
	{
		var result = {time:0, score:0, cost:{}, canBuild:true};
		var cost = self.cost(dysonPart.cost["part"]);
		cost["rocketFuel"] = dysonPart.cost["rocketFuel"];
		
		for (key in cost)
		{
			var prod = getProduction(key);
			if (prod < 1) {prod = 1;}
			
			// Cost is cost per energy unit
			var time = cost[key] / prod;
			if (time > result.time) {result.time = time;}
			result.cost[key] = cost[key] / dysonPart.prod;
			
			var score = 50000 * dysonPart.prod / Math.pow(time, 2);
			if (score < result.score || result.score == 0) {result.score = score;}
		}
		
		return result;
	};
	
	instance.update = function(self)
	{
		self.data[0] = {cost:{"part":50, "rocketFuel":50000}, prod:ringOutput, mk:buildRing};
		self.data[1] = {cost:{"part":100, "rocketFuel":250000}, prod:swarmOutput, mk:buildSwarm};
		self.data[2] = {cost:{"part":250, "rocketFuel":1000000}, prod:sphereOutput, mk:buildSphere};
		
		if (self.target == -1) {self.setTarget(self);}
		
		for (id = 0; id < 3; id++) {var score = self.score[id].score; if (score > Script.energy.maxScore && self.score[id].canBuild) {Script.energy.maxScore = score; self.target = id;}}
		
		var mult = Math.sqrt(1 + ring + swarm + sphere);
		
		for (id = 0; id < 3; id++)
		{
			var cost = self.score[id].cost;
			for (key in cost)
			{
				//Script.cons.addCons(Script.cons, key, Script.energy.max * self.score[id].score * cost[key] / (3600 * Script.energy.maxScore));
				Script.cost.addCost(Script.cost, key, mult * 3600 * self.score[id].score * cost[key] / Script.energy.maxScore);
			} 
		}
	};
	
	instance.setTarget = function(self)
	{
		self.score[0] = self.getScore(self, self.data[0]);
		self.score[1] = self.getScore(self, self.data[1]);
		
		if (Game.stargaze.unlocked != true && Game.tech.isUnlocked("unlockDysonSphere"))
		{
			self.score[2] = self.getScore(self, self.data[2]);
		}
		else {self.score[2] = {time:0, score:0, cost:{}, canBuild:false};}
		
		for (id = 0; id < 3; id++) {var score = self.score[id].score; if (score > Script.energy.maxScore && self.score[id].canBuild) {Script.energy.maxScore = score; self.target = id;}}
	};
	
	instance.cost = function(parts)
	{
		var mult = (Math.pow(1.02, parts + 1) - 1) / 0.02;
		return {"titanium":mult*300000, "gold":mult*100000, "silicon":mult*200000, "meteorite":mult*1000, "ice":mult*100000};
	};
	
	instance.build = function(self)
	{
		if (self.target >= 0)
		{
			buildDysonTo(250);
			building = self.data[self.target];
			if (dyson >= building.cost["part"] && getResource("rocketFuel") > building.cost.rocketFuel)
			{
				building.mk();
				self.setTarget(self);
			}
		}
	};
	
	return instance;
}());
