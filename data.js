Script.data = (function(){
	console.log("Space Companeer: Loading Data");
	
	instance = {};
	
	instance.energyData = {};
	instance.labData = {};
	instance.producerData = {};
	instance.producerColumn = "wood";
	instance.maxEnergy = 0;
	
	instance.update = function()
	{
		// Energy Producers
		instance.energyData[0] = {cost:{"metal":charcoalEngineMetalCost, "gem":charcoalEngineGemCost}, prod:charcoalEngineOutput, cons:{"charcoal":charcoalEngineCharcoalInput}};
		instance.energyData[1] = {cost:{"metal":solarPanelMetalCost, "gem":solarPanelGemCost}, prod:solarPanelOutput, cons:{}};
		
		// Science Producers
		instance.labData[0] = {cost:{"metal":labMetalCost, "gem":labGemCost, "wood":labWoodCost}, prod:labOutput};
		instance.labData[1] = {cost:{"metal":labT2MetalCost, "gem":labT2GemCost, "wood":labT2WoodCost}, prod:labT2Output};
		instance.labData[2] = {cost:{"metal":labT3MetalCost, "gem":labT3GemCost, "wood":labT3WoodCost}, prod:labT3Output};
		
		// Resource Producers
		instance.producerData["metal"][0] = {cost:{"metal":minerMetalCost, "wood":minerWoodCost}, prod:minerOutput, cons:{}, mk:getMiner};
		instance.producerData["metal"][1] = {cost:{"metal":heavyDrillMetalCost, "gem":heavyDrillGemCost, "oil":heavyDrillOilCost}, prod:heavyDrillOutput, cons:{"energy":heavyDrillEnergyInput}, mk:getHeavyDrill};
		
		instance.producerData["gem"][0] = {cost:{"metal":gemMinerMetalCost, "gem":gemMinerGemCost}, prod:gemMinerOutput, cons:{}, mk:getGemMiner};
		instance.producerData["gem"][1] = {cost:{"metal":advancedDrillMetalCost, "gem":advancedDrillGemCost, "oil":advancedDrillOilCost}, prod:advancedDrillOutput, cons:{"energy":advancedDrillEnergyInput}, mk:getAdvancedDrill};
		
		instance.producerData["wood"][0] = {cost:{"metal":woodcutterMetalCost, "wood":woodcutterWoodCost}, prod:woodcutterOutput, cons:{}, mk:getWoodcutter};
		instance.producerData["wood"][1] = {cost:{"metal":laserCutterMetalCost, "gem":laserCutterGemCost, "oil":laserCutterOilCost}, prod:laserCutterOutput, cons:{"energy":laserCutterEnergyInput}, mk:getLaserCutter};
		
		instance.producerData["charcoal"][0] = {cost:{"metal":woodburnerMetalCost, "wood":woodburnerWoodCost}, prod:woodburnerOutput, cons:{"wood":woodburnerWoodInput}, mk:getWoodburner};
		instance.producerData["charcoal"][1] = {cost:{"metal":furnaceMetalCost, "wood":furnaceWoodCost, "oil":furnaceOilCost}, prod:furnaceOutput, cons:{"energy":furnaceEnergyInput, "wood":furnaceWoodInput}, mk:getFurnace};
		
		instance.producerData["oil"][0] = {cost:{"metal":pumpMetalCost, "gem":pumpGemCost}, prod:pumpOutput, cons:{}, mk:getPump};
		instance.producerData["oil"][1] = {cost:{"metal":pumpjackMetalCost, "gem":pumpjackGemCost, "oil":pumpjackOilCost}, prod:pumpjackOutput, cons:{"energy":pumpjackEnergyInput}, mk:getPumpjack};
		
		var maxEnergy = 0;
		for (key in instance.producerData)
		{
			if ("energy" in instance.producerData[key][Script.machineTier].cons)
			{
				var energy = instance.producerData[key][Script.machineTier].cons["energy"];
				if (energy > maxEnergy) {maxEnergy = energy};
			}
		}
		instance.maxEnergy = maxEnergy;
	}
	
	return instance;
}());
