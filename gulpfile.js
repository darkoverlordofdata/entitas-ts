/**
 * Expose commands with gulp for use by WebStorm
 *
 */
var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('build', shell.task(['npm run build']));
gulp.task('clean', shell.task(['npm run clean']));
gulp.task('closurebuild', shell.task(['npm run closurebuild']));
gulp.task('config', shell.task(['npm run config']));
gulp.task('deploy', shell.task(['npm run deploy']));
gulp.task('jsdoc', shell.task(['npm run jsdoc']));
gulp.task('manifest', shell.task(['npm run manifest']));
gulp.task('serve', shell.task(['npm run serve']));
gulp.task('test', shell.task(['npm run test']));

gulp.task('publish', function() {
  var ghPages = require('gulp-gh-pages');
  return gulp.src('./build/web/**/*')
    .pipe(ghPages());
});



