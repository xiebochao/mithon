var MixlyTitle = {};

MixlyTitle.NOWTITLE = document.title;

MixlyTitle.updeteVersionNumber = function (newVersionNumber) {
	try {
		MixlyTitle.NOWTITLE = MixlyTitle.NOWTITLE.replace(/Mixly[\s]?[\d.]+/g, "Mixly " + newVersionNumber);
		document.title = MixlyTitle.NOWTITLE;
	} catch(e) {
		console.log(e);
	}
}

MixlyTitle.getVersionNumber = function () {
	try {
		return MixlyTitle.NOWTITLE.match(/Mixly[\s]?[\d.]+/g);
	} catch(e) {
		console.log(e);
		return "";
	}
}

MixlyTitle.updeteFilePath = function (newPath) {
	try {
		var pathArr = MixlyTitle.NOWTITLE.match(/\([^\n\r]+\)/g);
		if (pathArr) {
			MixlyTitle.NOWTITLE = MixlyTitle.NOWTITLE.replace(/\([^\n\r]+\)/g, "(" + newPath + ")");
			document.title = MixlyTitle.NOWTITLE;
		} else {
			MixlyTitle.NOWTITLE = MixlyTitle.NOWTITLE + " (" + newPath + ")";
			document.title = MixlyTitle.NOWTITLE;
		}
	} catch(e) {
		console.log(e);
	}
}

MixlyTitle.getFilePath = function () {
	try {
		return MixlyTitle.NOWTITLE.match(/\([^\n\r]+\)/g);
	} catch(e) {
		console.log(e);
		return "";
	}
}