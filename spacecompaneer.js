var Script = (function() {
	
	var phase = 0;
	var machineTier = 1;
	var labTier = 1;
	var energyTier = 0;
	
	function init()
	{
		setInterval(spaceCompaneer, 1000);
	}
	
	function spaceCompaneer()
	{
		u.gainResource('metal');
	}

}());

setTimeout(Script.init, 2000);
