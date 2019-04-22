Fork of: gulp-resx2json [![NPM version][npm-image]][npm-url] [![Build status][travis-image]][travis-url]

# gulp-resx2react-localize-redux

Modified the plugin to use with [react-localize-redux](https://github.com/ryandrewjohnson/react-localize-redux). I did this because I want to keep a single entry point for the resource files so API resources and UI resources would come from the same place. This plugin basically builds the resources for the UI project without the need to make an extra web api call to fetch them.

New stuff:
Ability to provide arguments resource prefix and separator:
```
{
  resourcePrefix: 'UI_',
  resourceSeparator: '_'
}
```
## Usage

Not yet on npm.

In your `gulpfile.js`:

```javascript
var resx2json = require('<not-yet-in-npm>');

gulp.task('build-resx', function(){
  gulp.src(['resource.resx'])
    .pipe(resx2json({resourcePrefix = 'UI_', resourceSeparator = '_'}))
    .pipe(gulp.dest('resources/resource.json'));
});
```
