var path = require('path')
var gulp = require('gulp')
var less = require('gulp-less')
var rename = require('gulp-rename')
var cleanCSS = require('gulp-clean-css')

var paths = {
  styles: {
    src: './style/**/*.less',
    dest: './style'
  }
}

function styles(){
  return gulp.src(paths.styles.src)
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest));
}

gulp.task('watch', function(){
  gulp.watch(paths.styles.src, styles)
})

gulp.task('server', function(){
  return require('./build/dev-server')
})

gulp.task('dev', ['watch', 'server'])

