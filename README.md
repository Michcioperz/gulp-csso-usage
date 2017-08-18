# gulp-csso-usage

This is a simple plugin (also my first plugin) I scratched together while working on a static website.

Given the HTML files, it creates a usage data JSON for [CSSO](https://github.com/css/csso).

### Example usage

```javascript
var gulp = require('gulp');
var usage = require('gulp-csso-usage');
var concat = require('gulp-concat');

gulp.task('usage', function() {
  return gulp.src('**/*.html')
    .pipe(concat('all.html'))
    .pipe(usage())
    .pipe(gulp.dest('.'));
});
```

This should create `all.json` file containing usage data in CSSO specified format. Skipping the concat part will result in separate usage files generated, because that may be something you wish for.

**Please bear in mind this is my first plugin and it might on the off chance destroy everything you've ever created. And I haven't had a chance to read the guidelines just yet.**
