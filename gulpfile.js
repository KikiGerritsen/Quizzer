var gulp        = require('gulp');
var log         = require('logging');
var bsfy        = require('browserify');
var src         = require('vinyl-source-stream');

var paths = {
  scripts : ['./app/*.js', './app/**/*.js']
};

gulp.task('browserify', function(){
  return bsfy('./app/main.js')
    .bundle()
    .pipe(src('main.js'))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('watch', function(){
  gulp.watch(paths.scripts, ['browserify']);
});
//run connect for private client test sever
gulp.task('default', ['browserify', 'watch']);
