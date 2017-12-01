var Script = (function() {
	
	var instance = {};
	instance.phase = 0;
	instance.machineTier = 1;
	instance.labTier = 1;
	instance.energyTier = 0;
	
	instance.spaceCompaneer = function()
	{
		console.log("Boop?");
		gainResource('metal');
	}
	
	instance.init = function()
	{
		console.log("Starting?");
		setInterval(this.spaceCompaneer, 1000);
		console.log("It should run now.");
	}
	
	return instance;
}());

setTimeout(Script.init, 2000);
