var MixlyConfig = {};

MixlyConfig.softwareConfig = {
	"version": "Mixly 2.0.1"
}

if (MixlyConfig.softwareConfig.hasOwnProperty("version") 
 && document.title.indexOf(MixlyConfig.softwareConfig["version"]) == -1) {
	document.title = MixlyConfig.softwareConfig["version"];
}