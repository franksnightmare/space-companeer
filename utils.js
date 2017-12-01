Script.scoreEntry = function(entry)
{
	var score = 1;
	
	score *= entry.prod;
	if (!score) {console.log(score);}
	
	var max = {time:1, res:"null", problem:false};
	for (var key in entry.cost)
	{
		var prod = getProduction(key);
		if (prod < prodLimit) {prod = prodLimit;}
		var time = entry.cost[key] / prod;
		
		if (max.res === "null" || time > max.time)
		{
			max.time = time;
			max.res = key;
		}
	}
	score /= max.time;
	
	var costs = 0;
	var div = 0;
	for (var key in entry.cons)
	{
		var prod = getProduction(key);
		var cost = entry.cons[key];
		if (prod < cost * (1 + Script.consumptionRemainder)) {max.res = key; max.problem = true;}
		
		costs += cost;
		div += 1;
	}
	if (costs) {score = div * score / costs;}
	
	return {score:score, res:max.res, problem:max.problem};
};
