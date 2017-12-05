console.log("Space Companeer: Loading Decion Functions");

Script.decisions = (function(){
	instance = {};
	
	instance.energyFocus = {id:0, res:"null", canBuild:false};
	instance.labFocus = {id:0, res:"null"};
	instance.producerFocus = {};
	
	instance.init = function()
	{
		instance.producerFocus["metal"] = {weight:1/3, current:0, tier:0, canBuild:false}
		instance.producerFocus["gem"] = {weight:1/3, current:0, tier:0, canBuild:false}
		instance.producerFocus["wood"] = {weight:1/3, current:0, tier:0, canBuild:false}
		instance.producerFocus["charcoal"] = {weight:0, current:0, tier:0, canBuild:false}
		instance.producerFocus["oil"] = {weight:0, current:0, tier:0, canBuild:false}
		instance.producerFocus["fuel"] = {weight:0, current:0, tier:0, canBuild:false}
	};
	
	// TODO
	// Add resource matrix thing in a new and improved form
	// Cleanup ALL the functions
	
	instance.updateResourceFocus = function(itterations)
	{
		var startPoint = Script.goals.productionGoals;
		
		var goal = {};
		for (var key in instance.producerFocus) {goal[key] = startPoint[key]; Script.goals.productionGoals[key] = 0; if (key === Script.producerColumn) {break;}}
		
		//var resLine = "GoalStart (";
		//for (var key in goal) {resLine += goal[key]; if (key === producerColumn) {break;} resLine += ", ";}
		//console.log(resLine + ")");
		
		for (var i = 0; i < itterations; i++)
		{
			var newGoal = {};
			var total = 0;
			for (var key in instance.producerFocus)
			{
				newGoal[key] = 0;
				total += goal[key];
				if (key === Script.producerColumn) {break;}
			}
			if (total) {for (var key in goal) {goal[key] /= total; if (key === Script.producerColumn) {break;}}}
			
			resLine = "GoalStep (";
			for (var key in instance.producerFocus) {resLine += goal[key]; if (key === Script.producerColumn) {break;} resLine += ", ";}
			console.log(resLine + ")");
			
			for (resource in producerFocus)
			{
				var building = Script.data.producerData[resource][instance.producerFocus[resource].tier]
				var max = 0;
				for (var key in building.cost)
				{
					var cost = building.cost[key];
					if (cost > max) {max = cost};
				}
				if (max < 1) {max = 1;}
				for (var key in building.cost)
				{
					newGoal[key] += goal[key] * building.cost[key] / max;
				}
				for (var key in building.cons)
				{
					newGoal[key] += goal[key] * 2 * building.cons[key] / max;
				}
				
				if (resource === producerColumn) {break;}
			}
			total = 0;
			for (var key in instance.producerFocus) {total += newGoal[key]; if (key === Script.producerColumn) {break;}}
			for (var key in instance.producerFocus) {goal[key] = newGoal[key] / total; if (key === Script.producerColumn) {break;}}
		}
		
		var total2 = 0;
		for (var key in instance.producerFocus)
		{
			total2 += goal[key];
			if (key === Script.producerColumn) {break;}
		}
		if (total2) {for (var key in instance.producerFocus) {instance.producerFocus[key].weight = goal[key] / total2;}}
	};
	
	instance.decideResourceBuildings = function ()
	{
		//var line1 = "ResScores: ";
		for (key in instance.producerFocus)
		{
			var best = 0;
			var score = -1;
			var canBuild = false;
			//line1 += "(";
			for (var i = 0; i < Script.machineTier; i++)
			{
				var result = Script.getScore(producerData[key][i]);
				//line1 += result.score;
				if (result.score > score)
				{
					best = i;
					score = result.score;
					canBuild = !result.problem;
				}
				
				if (key === "fuel" && i == Script.fuelTier - 1) {break;}
				
				//if (i == Script.machineTier - 1) {break;}
				//line1 += ", ";
			}
			//line1 += ")";
			
			instance.producerFocus[key].tier = best;
			instance.producerFocus[key].canBuild = canBuild;
			
			if (key === producerColumn) {break;}
			//line1 += " ";
		}
		//console.log(line1);
	};
	
	instance.buildResourceBuildings = function()
	{
		var best = "null";
		var score = -1;
		var line = "Scores: (";
		var line2 = "Current: (";
		var line3 = "MachineTiers (";
		for (key in instance.producerFocus)
		{
			var tier = instance.producerFocus[key].tier;
			var scale = (instance.producerFocus[key].weight - instance.producerFocus[key].current);
			var mult = Math.pow(2, scale * 4);
			
			var building = Script.data.producerData[key][tier];
			var result = Script.getScore(building);
			
			var finalScore = Math.pow(2, result.score) * mult
			//var finalScore = mult;
			if (finalScore > score)
			{
				best = key;
				score = finalScore;
			}
			
			line += (finalScore);
			line2 += (instance.producerFocus[key].current);
			line3 += (instance.producerFocus[key].tier);
			
			if (key === Script.producerColumn) {break;}
			
			line += ", ";
			line2 += ", ";
			line3 += ", ";
		}
		line += ")";
		line2 += ")";
		line3 += ")";
		console.log(line);
		//console.log(line2);
		console.log(line3);
		console.log("best: " + best + ", score: " + score + ", tier: " + instance.producerFocus[best].tier);
		
		if (best != "null" && instance.producerFocus[best].canBuild) {Script.data.producerData[best][instance.producerFocus[best].tier].mk();}
	};
	
	instance.decideEnergyBuilding = function ()
	{
		var best = 0;
		var score = -1;
		var focus = "null";
		var canBuild = false;
		for (var i = 0; i < Script.energyTier; i++)
		{
			var result = getScore(energyData[i]);
			//if (result.problem)
			//{
			//	result.score -= 2;
			//}
			if (focus === "null" || result.score > score)
			{
				best = i;
				score = result.score;
				focus = result.res;
				canBuild = !result.problem;
			}
		}
		
		instance.energyFocus = {id:best, res:focus, canBuild:canBuild};
	};

	instance.buildEnergyBuilding = function()
	{
		var building = Script.data.energyData[instance.energyFocus.id];
		
		if (!instance.energyFocus.canBuild)
		{
			for (key in building.cons)
			{
				if (getProduction[key] < building.cons[key])
				{
					var focus = instance.producerFocus[key];
					if (focus.canBuild)
					{
						Script.data.producerData[key][focus.tier].mk();
					}
					else
					{
						for (i = focus.tier - 1; i >= 0; i--)
						{
							var producer = Script.data.producerData[key][focus.tier];
							var canBuild = !Script.getScore(producer).problem;
							if (canBuild)
							{
								producer.mk();
								return;
							}
						}
					}
				}
			}
			return;
		}
		
		building.mk();
	};
	
	instance.decideLabBuilding = function()
	{
		var best = 0;
		var score = -1;
		var focus = "null";
		for (var i = 0; i < Script.labTier; i++)
		{
			var result = Script.getScore(labData[i]);
			if (focus === "null" || result.score > score)
			{
				best = i;
				score = result.score;
				focus = result.res;
			}
		}
		
		instance.labFocus = {id:best, res:focus};
	};
	
	instance.buildLabs = function()
	{
		Script.data.labData[instance.labFocus.id].mk();
	};
	
	return instance;
}());
