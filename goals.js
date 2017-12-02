Script.goals = (function(){
	console.log("Space Companeer: Loading Goal Automata");
	
	instance = {};
	
	instance.nodes = {"energy":0, "science":0, "production":0};
	instance.modifers = {"energy":0, "science":0, "production":1};
	instance.balance = {"energy":1/3, "science":1/3, "production":1/3};
	instance.newTechs = 0;
	
	instance.diminishNode = function(key, amount)
	{
		var strength = instance.nodes[key];
		
		if (strength < amount) {strength = 0;}
		else {strength -= amount;}
		
		instance.nodes[key] = strength;
	}
	
	instance.boostNode = function(key, amount)
	{
		instance.nodes[key] += instance.modifiers(key) * amount;
	}
	
	instance.updateNode = function(key)
	{
		instance.nodes[key] *= 0.9;
	}
	
	instance.sumNodes = function()
	{
		var total = 0;
		for (key in instance.nodes)
		{
			total += instance.nodes[key];
		}
		return total;
	}
	
	instance.update = function()
	{
		var energy = getProduction("energy");
		var maxEnergy = Script.data.maxEnergy;
		
		if (energy < 1) {boostNode("energy", maxEnergy);}
		else {boostNode("energy", (10/3) * (maxEnergy / energy));}
		
		boostNode("science", instance.newTechs / (instance.newTechs + 1));
		boostNode("production", 1);
		
		instance.diminishNode("production", 0.05 * instance.nodes["energy"]);
		instance.diminishNode("production", 0.05 * instance.nodes["science"]);
		instance.diminishNode("science", 0.05 * instance.nodes["energy"]);
		
		instance.updateNode("energy");
		instance.updateNode("science");
		instance.updateNode("production");
		
		var total = instance.sumNodes();
		for (key in instance.balance)
		{
			instance.balance[key] = instance.nodes[key] / total;
		}
	}
	
	instance.print = function()
	{
		console.log("(" + this.balance["energy"] + ", " + this.balance["science"] + ", " + this.balance["production"] + ")");
	}
	
	return instance;
}());
