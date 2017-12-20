Script.upgradeStorage = function ()
{
	if (Game.tech.isPurchased("unlockStorage"))
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
