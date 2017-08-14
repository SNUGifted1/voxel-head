var VoxConf = {};

{
	VoxConf.boolAdvertise = true; // whether to advertise this server on www.voxel-warriors.com
}

{
	VoxConf.strName = ''; // name of the server, which is being displayed in the server browser
}

{	
	VoxConf.strLoginPassword = ''; // password, that is required in order to join the game
	
	VoxConf.strLoginMotd = ''; // message of the day, which is being displayed within the game
}

{	
	VoxConf.intPhaseRound = 3; // number of total rounds per game
	
	VoxConf.intPhaseRemaining = 3 * 60 * 1000; // duration of each phase
}

{
	VoxConf.strWorldAvailable = [ 'worldBasic' ]; // available worlds, which are being used consecutively
}

{	
	VoxConf.intPlayerCapacity = 8; // player capacity, that limits the number of connected players
}

module.exports = function() {
	return VoxConf;
};