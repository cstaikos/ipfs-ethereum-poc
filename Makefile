browserify:
	browserify app.js -o bundle.js -d
watchify:
	watchify app.js -o bundle.js -v -d
