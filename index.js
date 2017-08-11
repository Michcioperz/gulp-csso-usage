var htmlparser = require("htmlparser2");
var gutil = require("gulp-util");
var through = require("through2"); // npm install --save through2

module.exports = function() {
  return through
    .obj(function(file, encoding, callback) {
      if (file.isNull()) return callback();
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
      htmlp.parseComplete(
        file instanceof Buffer ? file.toString() : file.contents.toString()
      );
      for (let tag of htmlp._cbs.dom) check_tag(tag);
      file.path = gutil.replaceExtension(file.path, ".json");
      file.contents = new Buffer(
        JSON.stringify({
          tags: Array.from(usage.tags),
          classes: Array.from(usage.classes),
          ids: Array.from(usage.ids)
        })
      );
      // Push the file back onto the stream queue (this was this.queue in through lib)
      this.push(file);
      callback();
    });
};
