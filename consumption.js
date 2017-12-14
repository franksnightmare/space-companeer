console.log("Space Companeer: Loading Consumption Handler");

Script.cons = (function(){
	instance = {};
	
	instance.resetCons = function(self)
	{
		for (key in Script.data.producerData) {self[key] = 0;}
	};
	
	instance.addCons = function(self, key, amount)
	{
		if (amount > self[key]) {self[key] = amount;}
	};
	
	return instance;
}());
