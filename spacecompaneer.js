var SC_base = 'https://franksnightmare.github.io/space-companeer/';

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
	};
	
	instance.boosterino = function()
	{
		var done = true;
		if (!getProduction('metal')) {gainResource('metal'); getMiner(); done = false;}
		if (!getProduction('gem')) {gainResource('gem'); getGemMiner(); done = false;}
		if (!getProduction('wood')) {gainResource('wood'); getWoodcutter(); done = false;}
		if (done) {instance.phase = 1; clearInterval(instance.boosterino_t);}
	};
	
	instance.init = function()
	{
		console.log("Starting Space Companeer");
		setInterval(instance.spaceCompaneer, 1000);
		instance.boosterino_t = setInterval(instance.boosterino, 100);
	};
	
	return instance;
}());

document.head.appendChild(document.createElement('script')).src = SC_base + 'utils.js';
document.head.appendChild(document.createElement('script')).src = SC_base + 'data.js';

setTimeout(Script.init, 2000);
