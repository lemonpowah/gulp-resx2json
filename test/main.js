/*global describe, it*/
"use strict";

var fs = require("fs"),
	es = require("event-stream"),
	should = require("should");

require("mocha");

delete require.cache[require.resolve("../")];

var gutil = require("gulp-util"),
	resx2 = require("../");


var options = { resourcePrefix: 'UI_', resourceSeparator: '_' };
runTest('resource.test1.json', 'resource.test1.resx', options);
options = {};
runTest('resource.test2.json', 'resource.test2.resx', options);
options = { resourceSeparator: '_' }
runTest('resource.test3.json', 'resource.test3.resx', options);

function runTest(expectedFileName, srcFileName, options) {
	describe("gulp-resx2", function () {

		var expectedFile = new gutil.File({
			path: "test/expected/" + expectedFileName,
			cwd: "test/",
			base: "test/expected",
			contents: fs.readFileSync("test/expected/" + expectedFileName)
		});

		it("should produce expected file via buffer", function (done) {

			var srcFile = new gutil.File({
				path: "test/fixtures/" + srcFileName,
				cwd: "test/",
				base: "test/fixtures",
				contents: fs.readFileSync("test/fixtures/" + srcFileName)
			});

			var stream = resx2(srcFile, options);

			stream.on("error", function (err) {
				should.exist(err);
				done(err);
			});

			stream.on("data", function (newFile) {

				should.exist(newFile);
				should.exist(newFile.contents);

				String(newFile.contents).should.equal(String(expectedFile.contents));
				done();
			});

			stream.write(srcFile);
			stream.end();
		});

		it("should error on stream", function (done) {

			var srcFile = new gutil.File({
				path: "test/fixtures/" + srcFileName,
				cwd: "test/",
				base: "test/fixtures",
				contents: fs.createReadStream("test/fixtures/" + srcFileName)
			});

			var stream = resx2(srcFile);

			stream.on("error", function (err) {
				should.exist(err);
				done();
			});

			stream.on("data", function (newFile) {
				newFile.contents.pipe(es.wait(function (err, data) {
					done(err);
				}));
			});

			stream.write(srcFile);
			stream.end();
		});
	});
}
