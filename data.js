console.log("Space Companeer: Loading Data");

Script.data = (function(){
	instance = {};
	
	instance.energyData = [{}, {}];
	instance.labData = [{}, {}, {}];
	
	instance.producerData = {};
	instance.producerData["metal"]  = [{}, {}];
	instance.producerData["wood"]  = [{}, {}];
	instance.producerData["gem"]  = [{}, {}];
	instance.producerData["charcoal"]  = [{}, {}];
	instance.producerData["oil"]  = [{}, {}];
	instance.producerData["fuel"]  = [{}];
	
	instance.producerColumn = "wood";
	instance.maxEnergy = 0;
	
	console.log("??????");
	
	instance.update = function()
	{
		// Production
		var total = 0;
		for (var key in Script.decisions.producerFocus)
		{
			var prod = getProduction(key);
			total += prod;
			Script.decisions.producerFocus[key].current = prod;
		}
		if (total) {for (var key in Script.decisions.producerFocus) {Script.decisions.producerFocus[key].current /= total;}}
		
		// Energy Producers
		instance.energyData[0] = {cost:{"metal":charcoalEngineMetalCost, "gem":charcoalEngineGemCost}, prod:charcoalEngineOutput, cons:{"charcoal":charcoalEngineCharcoalInput}, mk:getCharcoalEngine};
		instance.energyData[1] = {cost:{"metal":solarPanelMetalCost, "gem":solarPanelGemCost}, prod:solarPanelOutput, cons:{}, mk:getSolarPanel};
		
		// Science Producers
		instance.labData[0] = {cost:{"metal":labMetalCost, "gem":labGemCost, "wood":labWoodCost}, prod:labOutput, cons:{}, mk:getLab()};
		instance.labData[1] = {cost:{"metal":labT2MetalCost, "gem":labT2GemCost, "wood":labT2WoodCost}, prod:labT2Output, cons:{}, mk:getLabT2()};
		instance.labData[2] = {cost:{"metal":labT3MetalCost, "gem":labT3GemCost, "wood":labT3WoodCost}, prod:labT3Output, cons:{}, mk:getLabT3()};
		
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
		
		instance.producerData["fuel"][0] = {cost:{"metal":chemicalPlantMetalCost, "gem":chemicalPlantGemCost, "oil":chemicalPlantOilCost}, prod:chemicalPlantOutput, cons:{"oil":chemicalPlantOilInput, "charcoal":chemicalPlantCharcoalInput}, mk:getChemicalPlant};
		
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
	};
	
	return instance;
}());
