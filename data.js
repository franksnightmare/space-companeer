console.log("Space Companeer: Loading Data");

Script.data = (function(){
	instance = {};
	
	instance.labData = [{}, {}, {}];
	
	instance.producerData = {};
	instance.producerData["metal"] = [{}, {}, {}];
	instance.producerData["wood"] = [{}, {}, {}];
	instance.producerData["gem"] = [{}, {}, {}];
	instance.producerData["charcoal"]  = [{}, {}, {}];
	instance.producerData["oil"] = [{}, {}, {}];
	instance.producerData["rocketFuel"] = [{}, {}, {}];
	instance.producerData["lunarite"] = [{}, {}, {}];
	instance.producerData["methane"] = [{}, {}, {}];
	instance.producerData["titanium"] = [{}, {}, {}];
	instance.producerData["silicon"] = [{}, {}, {}];
	instance.producerData["gold"] = [{}, {}, {}];
	instance.producerData["silver"] = [{}, {}, {}];
	instance.producerData["hydrogen"] = [{}, {}, {}];
	instance.producerData["helium"] = [{}, {}, {}];
	instance.producerData["ice"] = [{}, {}, {}];
	instance.producerData["uranium"] = [{}, {}, {}];
	instance.producerData["lava"] = [{}, {}, {}];
	
	instance.producerScore = {};
	instance.producerScore["metal"] = {result:[{}, {}, {}], maxScore:0};
	instance.producerScore["wood"] = {result:[{}, {}, {}], maxScore:0};
	instance.producerScore["gem"] = {result:[{}, {}, {}], maxScore:0};
	instance.producerScore["charcoal"] = {result:[{}, {}, {}], maxScore:0};
	instance.producerScore["oil"] = {result:[{}, {}, {}], maxScore:0};
	instance.producerScore["rocketFuel"] = {result:[{}, {}, {}], maxScore:0};
	instance.producerScore["lunarite"] = {result:[{}, {}, {}], maxScore:0};
	instance.producerScore["methane"] = {result:[{}, {}, {}], maxScore:0};
	instance.producerScore["titanium"] = {result:[{}, {}, {}], maxScore:0};
	instance.producerScore["silicon"] = {result:[{}, {}, {}], maxScore:0};
	instance.producerScore["gold"] = {result:[{}, {}, {}], maxScore:0};
	instance.producerScore["silver"] = {result:[{}, {}, {}], maxScore:0};
	instance.producerScore["hydrogen"] = {result:[{}, {}, {}], maxScore:0};
	instance.producerScore["helium"] = {result:[{}, {}, {}], maxScore:0};
	instance.producerScore["ice"] = {result:[{}, {}, {}], maxScore:0};
	instance.producerScore["uranium"] = {result:[{}, {}, {}], maxScore:0};
	instance.producerScore["lava"] = {result:[{}, {}, {}], maxScore:0};
	
	instance.producerColumn = "wood";
	
	instance.build = function(data)
	{
		var maxScore = 0;
		var resource = "null";
		for (key in data.producerData)
		{
			var diff = (Script.goals[key]["amount"] - getProduction(key)) / data.maxProd;
			var score = Math.pow(2, diff);
			if (diff >= 0 && Script.goals[key]["type"] === "cons") {score *= 2;}
			if (score > maxScore) {maxScore = score; resource = key;}
			
			if (key === data.producerColumn) {break;}
		}
		maxScore = 0;
		var target = 0;
		if (resource !== "rocketFuel")
		{
			for (id in data.producerData[resource])
			{
				var result = data.producerScore[resource].result[id];
				if (result.score > maxScore && result.canBuild) {maxScore = result.score; target = id;}
				
				if (id == Script.machineTier) {break;}
			}
		}
		else
		{
			for (id in data.producerData[resource])
			{
				var result = data.producerScore[resource].result[id];
				if (result.score > maxScore && result.canBuild) {maxScore = result.score; target = id;}
				
				if (id == Script.fuelTier) {break;}
			}
		}
		
		var message = "Buildtarget: " + resource + "; tier: " + target + ".";
		console.log(message);
		data.producerData[resource][target].mk();
	};
	
	instance.resourceScore = function(building)
	{
		var result = {time:0, score:0, cost:{}, canBuild:true};
		for (key in building.cost)
		{
			var prod = getProduction(key);
			if (prod < 1) {prod = 1;}
			
			// Cost is cost per resource unit
			var time = building.cost[key] / prod;
			if (time > result.time) {result.time = time;}
			result.cost[key] = building.cost[key] / building.prod;
			
			var score = building.prod / time;
			if ("energy" in building.cons) {score /= building.cons["energy"];}
			if (score > result.score) {result.score = score;}
		}
		
		for (key in building.cons) {if (getProduction(key) < building.cons[key] * 2) {result.canBuild = false;}}
		return result;
	};
	
	instance.init = function(data)
	{
		data.producerScore = {};
		for (key in data.producerData)
		{
			data.producerScore[key] = {result:[{}, {}, {}], maxScore:0};
		}
	};
	
	instance.update = function(data)
	{
		// Production
		/*
		var total = 0;
		for (var key in Script.decisions.producerFocus)
		{
			var prod = getProduction(key);
			total += prod;
			Script.decisions.producerFocus[key].current = prod;
		}
		if (total) {for (var key in Script.decisions.producerFocus) {Script.decisions.producerFocus[key].current /= total;}}
		*/
		
		// Resource Producers
		data.producerData["metal"][0] = {cost:{"metal":minerMetalCost, "wood":minerWoodCost}, prod:minerOutput, cons:{}, mk:getMiner};
		data.producerData["metal"][1] = {cost:{"metal":heavyDrillMetalCost, "gem":heavyDrillGemCost, "oil":heavyDrillOilCost}, prod:heavyDrillOutput, cons:{"energy":heavyDrillEnergyInput}, mk:getHeavyDrill};
		data.producerData["metal"][2] = {cost:{"lunarite":gigaDrillLunariteCost, "gem":gigaDrillGemCost, "silicon":gigaDrillSiliconCost}, prod:gigaDrillOutput, cons:{"energy":gigaDrillEnergyInput}, mk:getGigaDrill};
		
		data.producerData["gem"][0] = {cost:{"metal":gemMinerMetalCost, "gem":gemMinerGemCost}, prod:gemMinerOutput, cons:{}, mk:getGemMiner};
		data.producerData["gem"][1] = {cost:{"metal":advancedDrillMetalCost, "gem":advancedDrillGemCost, "oil":advancedDrillOilCost}, prod:advancedDrillOutput, cons:{"energy":advancedDrillEnergyInput}, mk:getAdvancedDrill};
		data.producerData["gem"][2] = {cost:{"lunarite":diamondDrillLunariteCost, "gem":diamondDrillGemCost, "silicon":diamondDrillSiliconCost}, prod:diamondDrillOutput, cons:{"energy":diamondDrillEnergyInput}, mk:getDiamondDrill};
		
		data.producerData["wood"][0] = {cost:{"metal":woodcutterMetalCost, "wood":woodcutterWoodCost}, prod:woodcutterOutput, cons:{}, mk:getWoodcutter};
		data.producerData["wood"][1] = {cost:{"metal":laserCutterMetalCost, "gem":laserCutterGemCost, "oil":laserCutterOilCost}, prod:laserCutterOutput, cons:{"energy":laserCutterEnergyInput}, mk:getLaserCutter};
		data.producerData["wood"][2] = {cost:{"lunarite":deforesterLunariteCost, "titanium":deforesterTitaniumCost, "silicon":deforesterSiliconCost}, prod:deforesterOutput, cons:{"energy":deforesterEnergyInput}, mk:getDeforester};
		
		data.producerData["charcoal"][0] = {cost:{"metal":woodburnerMetalCost, "wood":woodburnerWoodCost}, prod:woodburnerOutput, cons:{"wood":woodburnerWoodInput}, mk:getWoodburner};
		data.producerData["charcoal"][1] = {cost:{"metal":furnaceMetalCost, "wood":furnaceWoodCost, "oil":furnaceOilCost}, prod:furnaceOutput, cons:{"energy":furnaceEnergyInput, "wood":furnaceWoodInput}, mk:getFurnace};
		data.producerData["charcoal"][2] = {cost:{"lunarite":kilnLunariteCost, "gem":kilnGemCost, "silicon":kilnSiliconCost}, prod:kilnOutput, cons:{"energy":kilnEnergyInput, "wood":kilnWoodInput}, mk:getKiln};
		
		data.producerData["oil"][0] = {cost:{"metal":pumpMetalCost, "gem":pumpGemCost}, prod:pumpOutput, cons:{}, mk:getPump};
		data.producerData["oil"][1] = {cost:{"metal":pumpjackMetalCost, "gem":pumpjackGemCost, "oil":pumpjackOilCost}, prod:pumpjackOutput, cons:{"energy":pumpjackEnergyInput}, mk:getPumpjack};
		data.producerData["oil"][2] = {cost:{"lunarite":oilFieldLunariteCost, "titanium":oilFieldTitaniumCost, "silicon":oilFieldSiliconCost}, prod:oilFieldOutput, cons:{"energy":oilFieldEnergyInput}, mk:getOilField};
		
		data.producerData["rocketFuel"][0] = {cost:{"metal":chemicalPlantMetalCost, "gem":chemicalPlantGemCost, "oil":chemicalPlantOilCost}, prod:chemicalPlantOutput, cons:{"oil":chemicalPlantOilInput, "charcoal":chemicalPlantCharcoalInput}, mk:getChemicalPlant};
		data.producerData["rocketFuel"][1] = {cost:{"metal":oxidisationMetalCost, "gem":oxidisationGemCost, "oil":oxidisationOilCost}, prod:oxidisationOutput, cons:{"oil":oxidisationOilInput, "charcoal":oxidisationCharcoalInput}, mk:getOxidisation};
		data.producerData["rocketFuel"][2] = {cost:{"titanium":hydrazineTitaniumCost, "silicon":hydrazineSiliconCost, "gold":hydrazineGoldCost}, prod:hydrazineOutput, cons:{"methane":hydrazineMethaneInput}, mk:getHydrazine};
		
		data.producerData["lunarite"][0] = {cost:{"gem":moonWorkerGemCost}, prod:moonWorkerOutput, cons:{}, mk:getMoonWorker};
		data.producerData["lunarite"][1] = {cost:{"metal":moonDrillMetalCost, "gem":moonDrillGemCost, "oil":moonDrillOilCost}, prod:moonDrillOutput, cons:{"energy":moonDrillEnergyInput}, mk:getMoonDrill};
		data.producerData["lunarite"][2] = {cost:{"lunarite":moonQuarryLunariteCost, "gem":moonQuarryGemCost, "silicon":moonQuarrySiliconCost}, prod:moonQuarryOutput, cons:{"energy":moonQuarryEnergyInput}, mk:getMoonQuarry};
		
		data.producerData["methane"][0] = {cost:{"lunarite":vacuumLunariteCost,"gem":vacuumGemCost}, prod:vacuumOutput, cons:{}, mk:getVacuum};
		data.producerData["methane"][1] = {cost:{"lunarite":suctionExcavatorLunariteCost, "gem":suctionExcavatorGemCost, "oil":suctionExcavatorOilCost}, prod:suctionExcavatorOutput, cons:{"energy":suctionExcavatorEnergyInput}, mk:getSuctionExcavator};
		data.producerData["methane"][2] = {cost:{"lunarite":spaceCowLunariteCost, "titanium":spaceCowTitaniumCost, "silicon":spaceCowSiliconCost}, prod:spaceCowOutput, cons:{"energy":spaceCowEnergyInput}, mk:getSpaceCow};
		
		data.producerData["titanium"][0] = {cost:{"gem":explorerGemCost}, prod:explorerOutput, cons:{}, mk:getExplorer};
		data.producerData["titanium"][1] = {cost:{"lunarite":lunariteDrillLunariteCost, "gem":lunariteDrillGemCost, "oil":lunariteDrillOilCost}, prod:lunariteDrillOutput, cons:{"energy":lunariteDrillEnergyInput}, mk:getLunariteDrill};
		data.producerData["titanium"][2] = {cost:{"lunarite":pentaDrillLunariteCost, "gem":pentaDrillGemCost, "silicon":pentaDrillSiliconCost}, prod:pentaDrillOutput, cons:{"energy":pentaDrillEnergyInput}, mk:getPentaDrill};
		
		data.producerData["silicon"][0] = {cost:{"lunarite":blowtorchLunariteCost, "titanium":blowtorchTitaniumCost}, prod:blowtorchOutput, cons:{}, mk:getBlowtorch};
		data.producerData["silicon"][1] = {cost:{"lunarite":scorcherLunariteCost, "gem":scorcherGemCost, "oil":scorcherOilCost}, prod:scorcherOutput, cons:{"energy":scorcherEnergyInput}, mk:getScorcher};
		data.producerData["silicon"][2] = {cost:{"lunarite":annihilatorLunariteCost, "gem":annihilatorGemCost, "silver":annihilatorSilverCost}, prod:annihilatorOutput, cons:{"energy":annihilatorEnergyInput}, mk:getAnnihilator};
		
		data.producerData["gold"][0] = {cost:{"lunarite":droidLunariteCost, "methane":droidMethaneCost}, prod:droidOutput, cons:{}, mk:getDroid};
		data.producerData["gold"][1] = {cost:{"lunarite":destroyerLunariteCost, "gem":destroyerGemCost, "oil":destroyerOilCost}, prod:destroyerOutput, cons:{"energy":destroyerEnergyInput}, mk:getDestroyer};
		data.producerData["gold"][2] = {cost:{"lunarite":deathStarLunariteCost, "silicon":deathStarSiliconCost, "silver":deathStarSilverCost}, prod:deathStarOutput, cons:{"energy":deathStarEnergyInput}, mk:getDeathStar};
		
		data.producerData["silver"][0] = {cost:{"lunarite":scoutLunariteCost, "titanium":scoutTitaniumCost}, prod:scoutOutput, cons:{}, mk:getScout};
		data.producerData["silver"][1] = {cost:{"lunarite":spaceLaserLunariteCost, "gem":spaceLaserGemCost, "oil":spaceLaserOilCost}, prod:spaceLaserOutput, cons:{"energy":spaceLaserEnergyInput}, mk:getSpaceLaser};
		data.producerData["silver"][2] = {cost:{"lunarite":berthaLunariteCost, "titanium":berthaTitaniumCost, "silicon":berthaSiliconCost}, prod:berthaOutput, cons:{"energy":berthaEnergyInput}, mk:getBertha};
		
		data.producerData["hydrogen"][0] = {cost:{"lunarite":collectorLunariteCost, "titanium":collectorTitaniumCost}, prod:collectorOutput, cons:{}, mk:getCollector};
		data.producerData["hydrogen"][1] = {cost:{"lunarite":magnetLunariteCost, "titanium":magnetTitaniumCost, "gold":magnetGoldCost}, prod:magnetOutput, cons:{"energy":magnetEnergyInput}, mk:getMagnet};
		data.producerData["hydrogen"][2] = {cost:{"silicon":eCellSiliconCost, "gold":eCellGoldCost, "silver":eCellSilverCost}, prod:eCellOutput, cons:{"energy":eCellEnergyInput}, mk:getECell};
		
		data.producerData["helium"][0] = {cost:{"lunarite":droneLunariteCost, "silicon":droneSiliconCost}, prod:droneOutput, cons:{}, mk:getDrone};
		data.producerData["helium"][1] = {cost:{"lunarite":tankerLunariteCost, "titanium":tankerTitaniumCost, "silicon":tankerSiliconCost}, prod:tankerOutput, cons:{"energy":tankerEnergyInput}, mk:getTanker};
		data.producerData["helium"][2] = {cost:{"lunarite":compressorLunariteCost, "titanium":compressorTitaniumCost, "silicon":compressorSiliconCost}, prod:compressorOutput, cons:{"energy":compressorEnergyInput}, mk:getCompressor};
		
		data.producerData["ice"][0] = {cost:{"lunarite":icePickLunariteCost, "gem":icePickGemCost}, prod:icePickOutput, cons:{}, mk:getIcePick};
		data.producerData["ice"][1] = {cost:{"lunarite":iceDrillLunariteCost, "titanium":iceDrillTitaniumCost, "silicon":iceDrillSiliconCost}, prod:iceDrillOutput, cons:{"energy":iceDrillEnergyInput}, mk:getIceDrill};
		data.producerData["ice"][2] = {cost:{"lunarite":freezerLunariteCost, "titanium":freezerTitaniumCost, "silicon":freezerSiliconCost}, prod:freezerOutput, cons:{"energy":freezerEnergyInput}, mk:getFreezer};
		
		data.producerData["uranium"][0] = {cost:{"lunarite":grinderLunariteCost, "titanium":grinderTitaniumCost, "gold":grinderGoldCost}, prod:grinderOutput, cons:{}, mk:getGrinder};
		data.producerData["uranium"][1] = {cost:{"oil":cubicOilCost, "lunarite":cubicLunariteCost, "uranium":cubicUraniumCost}, prod:cubicOutput, cons:{"energy":cubicEnergyInput}, mk:getCubic};
		data.producerData["uranium"][2] = {cost:{"lunarite":enricherLunariteCost, "titanium":enricherTitaniumCost, "silicon":enricherSiliconCost}, prod:enricherOutput, cons:{"energy":enricherEnergyInput}, mk:getEnricher};
		
		data.producerData["lava"][0] = {cost:{"lunarite":crucibleLunariteCost, "gem":crucibleGemCost}, prod:crucibleOutput, cons:{}, mk:getCrucible};
		data.producerData["lava"][1] = {cost:{"lunarite":extractorLunariteCost, "titanium":extractorTitaniumCost, "silicon":extractorSiliconCost}, prod:extractorOutput, cons:{"energy":extractorEnergyInput}, mk:getExtractor};
		data.producerData["lava"][2] = {cost:{"lunarite":extruderLunariteCost, "titanium":extruderTitaniumCost, "silicon":extruderSiliconCost}, prod:extruderOutput, cons:{"energy":extruderEnergyInput}, mk:getExtruder};
		
		// Scores
		for (key in data.producerScore)
		{
			var maxScore = 0;
			for (id in data.producerScore[key])
			{
				var building = data.producerData[key][id];
				var result = data.resourceScore(building);
				if (result.score > maxScore) {maxScore = result.score;}
				data.producerScore[key].result[id] = result;
			}
			data.producerScore[key].maxScore = maxScore;
			
			if (key === data.producerColumn) {break;}
		}
		
		data.maxProd = 0;
		var maxEnergy = 0;
		for (key in data.producerData)
		{
			data.maxProd += getProduction(key);
			if (key !== "rocketFuel")
			{
				var building = data.producerData[key][Script.machineTier - 1];
				for (resource in building.cons)
				{
					if (resource === "energy")
					{
						var energy = building.cons[resource];
						if (energy > maxEnergy) {maxEnergy = energy;}
					}
					else
					{
						Script.cons.addCons(building.cons[resource] * 4);
					}
				}
			}
			else
			{
				var building = data.producerData[key][Script.fuelTier - 1];
				for (resource in building.cons) {Script.cons.addCons(building.cons[resource] * 4);}
			}
			
			if (key === data.producerColumn) {break;}
		}
		Script.energy.max = maxEnergy;
	};
	
	return instance;
}());
