console.log("Space Companeer: Loading SCIENCE");

Script.science = (function(){
	instance = {};
	
	instance.techs = [
	{name:"unlockStorage", available:true, done:false, unlocks:["unlockBasicOil"], consequences:function(){}},
	{name:"unlockBasicEnergy", available:true, done:false, unlocks:["unlockSolar", "unlockMachines", "upgradeEngineTech"], consequences:function(){Script.data.producerColumn = "charcoal"; Script.energyTier = 1;}},
	{name:"unlockOil", available:false, done:false, unlocks:[], consequences:function(){Script.data.producerColumn = "oil";}},
	{name:"unlockSolar", available:false, done:false, unlocks:["upgradeSolarTech"], consequences:function(){Script.energyTier = 2;}},
	{name:"unlockMachines", available:false, done:false, unlocks:["unlockDestruction", "unlockSolarSystem", "upgradeResourceTech"], consequences:function(){Script.machineTier = 2;}},
	{name:"unlockDestruction", available:false, done:false, unlocks:[], consequences:function(){}},
	{name:"unlockSolarSystem", available:false, done:false, unlocks:["unlockLabT2", "unlockRocketFuelT2"], consequences:function(){Script.data.producerColumn = "fuel"; Script.fuelTier = 1; Script.phase = 1;}},
	{name:"upgradeResourceTech", available:false, done:false, unlocks:[], consequences:function(){}},,
	{name:"unlockLabT2", available:false, done:false, unlocks:["unlockLabT3"], consequences:function(){Script.labTier = 2;}},
	{name:"upgradeEngineTech", available:false, done:false, unlocks:[], consequences:function(){}},
	{name:"unlockLabT3", available:false, done:false, unlocks:[], consequences:function(){Script.labTier = 3;}},
	{name:"upgradeSolarTech", available:false, done:false, unlocks:[], consequences:function(){}},
	{name:"unlockRocketFuelT2", available:false, done:false, unlocks:[], consequences:function(){}}
	];
	
	instance.unlockTechs = function(self, techs)
	{
		for (i = 0; i < techs.length; i++)
		{
			for (j = 0; j < techs.length; j++)
			{
				if (techs[i] === self.techs[j].name && !self.techs[j].available)
				{
					self.techs[j].available = true;
					Script.goals.techs += 1;
				}
			}
		}
	};
	
	instance.purchaseTech = function(self)
	{
		for (i = 0; i < techs.length; i++)
		{
			var tech = self.techs[i];
			if (!tech.done)
			{
				purchaseTech(tech.name);
				if (isPurchased(tech.name))
				{
					self.techs[i].done = true;
					self.unlockTechs(self, tech.unlocks);
					
					Script.goals.techs -= 1;
					
					tech.consequences();
				}
			}
		}
	};
	
	return instance;
}());
