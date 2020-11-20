var gulp          = require('gulp');
var browserSync   = require('browser-sync').create();
var $             = require('gulp-load-plugins')();
// var autoprefixer  = require('autoprefixer');
var webpackStream =require('webpack-stream');
var webpack2      = require('webpack');
var concat = require('gulp-concat');
function sass() {
  return gulp.src('app/scss/*.scss')
    .pipe($.sass({
      outputStyle: 'compressed' // if css compressed **file size**
    })
      .on('error', $.sass.logError))
    // .pipe($.postcss([
    //   autoprefixer({ browsers: ['last 2 versions', 'ie >= 9'] })
    // ]))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());
}

let webpackConfig = {
  module: {
    rules: [
      {
        test: /.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  }
};


function javascript() {
  return gulp.src("app/js/*.js")
    .pipe(webpackStream(webpackConfig, webpack2))

    .pipe(concat('app.js'))
    // .pipe($.sourcemaps.init())
    // .pipe($.if(PRODUCTION, $.uglify()
    //   .on('error', e => { console.log(e); })
    // ))
    // .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest('app/js/min')).pipe(browserSync.stream());
}


function serve() {
  browserSync.init({
    server: "./app"
  });

  gulp.watch("app/js/*.js", javascript);
  gulp.watch("app/scss/**/*.scss", sass);
  gulp.watch("app/*.html").on('change', browserSync.reload);
}


gulp.task('javascript', javascript);
gulp.task('sass', sass);
gulp.task('serve', gulp.series('sass',serve));
gulp.task('default', serve);
