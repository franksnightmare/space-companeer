var Script = (function() {
	
	var instance = {};
	instance.phase = 0;
	instance.machineTier = 1;
	instance.labTier = 1;
	instance.energyTier = 0;
	
	instance.u = unsafeWindow;
	
	instance.init = function()
	{
		setInterval(spaceCompaneer, 1000);
	}
	
	instance.spaceCompaneer = function()
	{
		u.gainResource('metal');
	}
	
	
	return instance;
}());

setTimeout(Script.init, 2000);
