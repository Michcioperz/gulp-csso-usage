var htmlparser = require("htmlparser");
var gutil = require("gulp-util");
var through = require("through2"); // npm install --save through2

module.exports = function() {
  return through.obj(function(file, encoding, callback) {
    // TODO: cross the streams
    let usage = { tags: new Set(), classes: new Set(), ids: new Set() };
    let check_tag = function(tag) {
      if (tag.type == "tag") {
        usage.tags.add(tag.name);
        if (tag.children) for (let child of tag.children) check_tag(child);
        if (tag.attribs) {
          if (tag.attribs["class"])
            for (let tag_class of tag.attribs["class"].trim().split(/\s/))
              usage.classes.add(tag_class);
          if (tag.attribs["id"]) usage.ids.add(tag.attribs["id"].trim());
        }
      }
    };
    let htmlp = new htmlparser.Parser(new htmlparser.DefaultHandler());
    if (file instanceof Buffer) {
      htmlp.parseComplete(file.toString());
    } else {
      if (file.isNull()) return callback(null, file);
      htmlp.parseComplete(file.contents.toString());
    }
    for (let tag of htmlp._handler.dom) check_tag(tag);
    file.path = gutil.replaceExtension(file.path, ".json");
    file.contents = new Buffer(
      JSON.stringify({
        tags: Array.from(usage.tags),
        classes: Array.from(usage.classes),
        ids: Array.from(usage.ids)
      })
    );
    return callback(null, file);
  });
};
