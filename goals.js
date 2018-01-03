console.log("Space Companeer: Loading Goal Automata");

Script.goals = (function(){
	instance = {};
	
	instance.newTechs = 2;
	
	instance.lock = {};
	instance.lock["energy"] = false;
	instance.lock["science"] = false;
	instance.lock["resource"] = false;
	
	instance.lockEverything = function(self)
	{
		self.lock["energy"] = true;
		self.lock["science"] = true;
		self.lock["resource"] = true;
	};
	
	instance.setGoals = function(self)
	{
		if (Script.cost.total) {for (key in Script.data.producerData) {Script.cost.balance[key] = Script.cost[key] / Script.cost.total;}}
		
		for (key in Script.data.producerData)
		{
			self[key] = {amount:0, type:"null"};
			
			var request = Script.cons[key];
			if (request > self[key].amount) {self[key].amount = request; self[key].type = "cons";}
			
			if (Script.cost.counter[key])
			{
				request = Script.data.maxProd * Script.cost.balance[key];
				if (request > self[key].amount) {self[key].amount = request; self[key].type = "cost";}
			}
		}
	};
	
	instance.build = function()
	{
		if (!Script.goals.lock["energy"]) {Script.energy.build(Script.energy);}
		if (!Script.goals.lock["science"]) {Script.data.build(Script.data);}
		if (!Script.goals.lock["resource"]) {Script.science.build(Script.science);}
		
		Script.goals.lock["energy"] = false;
		Script.goals.lock["science"] = false;
		Script.goals.lock["resource"] = false;
	};
	
	return instance;
}());
