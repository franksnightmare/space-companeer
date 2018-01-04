Script.upgradeStorage = function ()
{
	if (Game.tech.isPurchased("unlockStorage") && !Script.goals.lock["storage"])
	{
		upgradeMetalStorage();
		upgradeGemStorage();
		upgradeWoodStorage();
		upgradeCharcoalStorage();
		upgradeOilStorage();
		upgradeLunariteStorage();
		upgradeMethaneStorage();
		upgradeTitaniumStorage();
		upgradeSiliconStorage();
		upgradeGoldStorage();
		upgradeSilverStorage();
		upgradeHydrogenStorage();
		upgradeHeliumStorage();
		upgradeUraniumStorage();
		upgradeLavaStorage();
		upgradeIceStorage();
		upgradeMeteoriteStorage();
	}
};
