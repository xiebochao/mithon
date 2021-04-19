var MixlyTitle = {};

if (MixlyConfig.softwareConfig.hasOwnProperty("version") && MixlyUrl.BOARD_CONFIG.hasOwnProperty("BoardName")) {
	MixlyTitle.TITLE = MixlyConfig.softwareConfig["version"] + " For " + MixlyUrl.BOARD_CONFIG["BoardName"];
	document.title = MixlyTitle.TITLE;
} else {
	MixlyTitle.TITLE = document.title;
}
MixlyTitle.NOWTITLE = MixlyTitle.TITLE;

MixlyTitle.updeteVersionNumber = function (newVersionNumber) {
	try {
		MixlyTitle.NOWTITLE = document.title.replace(/Mixly[\s]?[\d.]+/g, "Mixly " + newVersionNumber);
		document.title = MixlyTitle.NOWTITLE;
	} catch(e) {
		console.log(e);
	}
}

MixlyTitle.getVersionNumber = function () {
	try {
		MixlyTitle.NOWTITLE = document.title.match(/Mixly[\s]?[\d.]+/g);
		return MixlyTitle.NOWTITLE;
	} catch(e) {
		console.log(e);
		return "";
	}
}

MixlyTitle.updeteFilePath = function (newPath) {
	try {
		var pathArr = MixlyTitle.NOWTITLE.match(/\([^\n\r]+\)/g);
		if (pathArr) {
			MixlyTitle.NOWTITLE = document.title.replace(/\([^\n\r]+\)/g, "(" + newPath + ")");
			document.title = MixlyTitle.NOWTITLE;
		} else {
			MixlyTitle.NOWTITLE = document.title + " (" + newPath + ")";
			document.title = MixlyTitle.NOWTITLE;
		}
	} catch(e) {
		console.log(e);
	}
}

MixlyTitle.getFilePath = function () {
	try {
		MixlyTitle.NOWTITLE = document.title.match(/(?<=\()[^\n\r]+(?=\))/g);
		return MixlyTitle.NOWTITLE;
	} catch(e) {
		console.log(e);
		return "";
	}
}

MixlyTitle.updateTitle = function (newTitle) {
	MixlyTitle.NOWTITLE = newTitle;
	document.title = newTitle;
}