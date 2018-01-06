console.log("Space Companeer: Loading Goal Automata");

Script.goals = (function(){
	instance = {};
	
	instance.newTechs = 2;
	
	instance.lock = {};
	instance.lock["energy"] = false;
	instance.lock["science"] = false;
	instance.lock["resource"] = false;
	instance.lock["storage"] = false;
	
	instance.unlockEverything = function(self)
	{
		for (key in self.lock) {self.lock[key] = false;}
	};
	
	instance.lockEverything = function(self)
	{
		for (key in self.lock) {self.lock[key] = true;}
	};
	
	instance.setGoals = function(self)
	{
		if (Script.cons["wood"] < Script.cons["charcoal"] * 2)
		{
			Script.cons.addCons(Script.cons, "wood", Script.cons["charcoal"] * 2);
		}
		
		if (Script.cost.total) {for (key in Script.data.producerData) {Script.cost.balance[key] = Script.cost[key] / Script.cost.total;}}
		
		for (key in Script.data.producerData)
		{
			self[key] = {amount:0, type:"null"};
			
			var request = Script.cons[key];
			if (request > self[key].amount) {self[key].amount = request; self[key].type = "cons";}
			
			if (Script.cost.counter[key])
			{
				request = 1.6 * Script.data.maxProd * Script.cost.balance[key];
				if (Script.phase <= 3) {request *= 1.15;}
				if (request > self[key].amount) {self[key].amount = request; self[key].type = "cost";}
			}
		}
	};
	
	instance.build = function()
	{
		if (!Script.goals.lock["energy"]) {Script.energy.build(Script.energy);}
		if (!Script.goals.lock["science"]) {Script.data.build(Script.data);}
		if (!Script.goals.lock["resource"]) {Script.science.build(Script.science);}
		
		Script.goals.unlockEverything(Script.goals);
	};
	
	return instance;
}());
