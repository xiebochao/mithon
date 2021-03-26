var FS = microbitFsWrapper();

if (Mixly_20_environment) {
	FS.setupFilesystem().then(function() {
	    console.log('FS fully initialised');
	}).fail(function() {
	    console.error('There was an issue initialising the file system.');
	});
} else {
	FS.setupFilesystem();
}