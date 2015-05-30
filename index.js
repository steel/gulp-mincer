var through     = require('through2');
// var PluginError = require('gulp-util').PluginError;
var gutil = require('gulp-util');
var gfile = require('gulp-file');
var path = require('path');

// consts
const PLUGIN_NAME = 'gulp-mincer';

module.exports = function(env) {
  if (!env) {
    throw new PluginError(PLUGIN_NAME, 'Missing Mincer Environment.');
  }

  var obj = through.obj(function(file, enc, cb){

    var asset = env.findAsset(file.path);

    var cleansedFilename = path.basename(asset.pathname.replace(".coffee", ""));

    var sourceMapName = cleansedFilename + ".map";

    var sourceMappingUrlComment = "\n//# sourceMappingUrl=" + sourceMapName;

    if ( file.isStream() ) {
      var stream = through();

      stream.write(asset.toString() + sourceMappingUrlComment);

      file.contents = stream;
    }

    if ( file.isBuffer() ) {
      file.base = "/";
      file.path = "/" + cleansedFilename;
      file.contents = new Buffer(asset.toString() + sourceMappingUrlComment);
    }

    this.emit("sourceMap", gfile(sourceMapName, asset.sourceMap, {src: true}));

    cb(null, file);
  });

  return obj;
}
