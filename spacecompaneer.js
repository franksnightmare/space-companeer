var SC_base = 'https://franksnightmare.github.io/space-companeer/';

var Script = (function() {
	
	var instance = {};
	instance.phase = 0;
	instance.machineTier = 1;
	instance.labTier = 1;
	instance.energyTier = 0;
	
	instance.spaceCompaneer = function()
	{
		Script.goals.update();
		Script.goals.print();
	};
	
	instance.boosterino = function()
	{
		var done = true;
		if (!getProduction('metal')) {gainResource('metal'); getMiner(); done = false;}
		if (!getProduction('gem')) {gainResource('gem'); getGemMiner(); done = false;}
		if (!getProduction('wood')) {gainResource('wood'); getWoodcutter(); done = false;}
		if (done) {this.phase = 1; clearInterval(this.boosterino_t); setInterval(instance.spaceCompaneer, 1000); console.log("Space Companeer: Phase 0 complete!");}
	};
	
	instance.init = function()
	{
		console.log("Space Companeer: Starting Space Companeer...");
		instance.boosterino_t = setInterval(instance.boosterino, 1000);
	};
	
	return instance;
}());

document.head.appendChild(document.createElement('script')).src = SC_base + 'utils.js';
document.head.appendChild(document.createElement('script')).src = SC_base + 'data.js';
document.head.appendChild(document.createElement('script')).src = SC_base + 'goals.js';

setTimeout(Script.init, 2000);
