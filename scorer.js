var u = unsafeWindow;

Script.scoreEntry = function(entry)
{
	var score = 1;
	
	score *= entry.prod;
	if (!score) {console.log(score);}
	
	var max = {time:1, res:"null", problem:false};
	for (var key in entry.cost)
	{
		var prod = u.getProduction(key);
		if (prod < prodLimit) {prod = prodLimit;}
		var time = entry.cost[key] / prod;
		
		if (max.res === "null" || time > max.time)
		{
			max.time = time;
			max.res = key;
		}
	}
	score /= max.time;
	if (!score) {console.log(score);}
	
	var costs = 0;
	var div = 0;
	for (var key in entry.cons)
	{
		var prod = u.getProduction(key);
		var cost = entry.cons[key];
		if (prod < cost * (1 + consumptionRemainder)) {max.res = key; max.problem = true;}
		
		costs += cost;
		div += 1;
	}
	if (costs) {score = div * score / costs;}
	
	return {score:score, res:max.res, problem:max.problem};
};
