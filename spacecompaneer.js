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
		this.Data.update();
	}

}());

setTimeout(Script.init, 2000);
