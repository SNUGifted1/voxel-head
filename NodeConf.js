var NodeConf = {};

{
	NodeConf.boolExpress = true;
	
	NodeConf.intExpressPort = 15897;
	
	NodeConf.strExpressSession = '';
	
	NodeConf.strExpressSecret = '';
}

{
	NodeConf.boolHypertextmin = true;
}

{
	NodeConf.boolMime = true;
}

{
	NodeConf.boolMustache = true;
}

{
	NodeConf.boolSocket = true;
}

module.exports = function() {
	return NodeConf;
};