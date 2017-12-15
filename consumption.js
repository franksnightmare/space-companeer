console.log("Space Companeer: Loading Consumption Handler");

Script.cons = (function(){
	instance = {};
	instance.max = 0;
	
	instance.resetCons = function(self)
	{
		for (key in Script.data.producerData) {self[key] = 0; self.max = 0;}
	};
	
	instance.addCons = function(self, key, amount)
	{
		if (amount > self[key]) {self[key] = amount; self.max += amount;}
	};
	
	return instance;
}());
