var Script = (function() {
	
	var instance = {};
	instance.phase = 0;
	instance.machineTier = 1;
	instance.labTier = 1;
	instance.energyTier = 0;
	
	instance.init = function()
	{
		console.log("Starting?");
		setInterval(self.spaceCompaneer, 1000);
	}
	
	instance.spaceCompaneer = function()
	{
		console.log("Boop?");
		gainResource('metal');
	}
	
	return instance;
}());

setTimeout(Script.init, 2000);
