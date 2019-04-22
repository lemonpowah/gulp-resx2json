var xmldoc = require("xmldoc");
var through2 = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var Buffer = require('buffer').Buffer;
var path = require('path');

const PLUGIN_NAME = "gulp-resx2jreact-localize-redux";

module.exports = function (opt, args) {
  opt = opt || {};
  // Convert XML to JSON
  var doConvert = function (file, args) {
    var xml = file.contents;
    var doc = new xmldoc.XmlDocument(xml);

    var resourceObject = {};
    var valueNodes = doc.childrenNamed("data");

    if (!args || args && Object.keys(args).length == 0) {
      valueNodes.forEach(function (element) {
        var name = element.attr.name;
        var value = element.firstChild.val;
        resourceObject[name] = value;
      });
    }
    else {
      valueNodes.forEach(function (element) {
        var resourceCategory = '';
        var resourceName = '';
        var resourceValue = '';

        var resourceKey = element.attr.name;
        if (args.resourcePrefix && resourceKey.startsWith(args.resourcePrefix)) {
          resourceKey = resourceKey.replace(args.resourcePrefix, '');
        }

        if (args.resourceSeparator) {
          var arrayChunks = resourceKey.split(args.resourceSeparator)
          if (arrayChunks.length == 2) {
            if (!arrayChunks[0])
              return;
            resourceCategory = arrayChunks[0];
            resourceName = arrayChunks[1];
            resourceValue = element.firstChild.val;
          }

          if (resourceValue) {
            resourceObject[resourceCategory] = resourceObject[resourceCategory] || {};
            resourceObject[resourceCategory][resourceName] = resourceValue;
          }
        }
      });
    }

    return JSON.stringify(resourceObject);
  };

  var throughCallback = function (file, enc, cb) {
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return cb();
    }

    if (file.isBuffer()) {
      file.contents = new Buffer(doConvert(file, args));
    }

    this.push(file);
    return cb();
  };

  return through2.obj(throughCallback);
};
