const { src, dest, watch, pipe, series, parallel } = require('gulp');
const del = require('del');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const browsersync = require('browser-sync').create();
const open = require('gulp-open');
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser-js');
const buffer = require('vinyl-buffer');

const GAMEDIR = "game";

function clean () {
    return del(["dist"]);
}

function html() {
    return src("./src/assets/html/*.html")
        .pipe(dest("./dist"))
        .pipe(browsersync.stream());
}

function assets () {
    return src(["./src/assets/**/*","!./src/assets/html/*.html"])
        .pipe(dest("./dist/assets", {force:true}))
        .pipe(browsersync.stream());
}

function build() {
  return browserify('./src/game/index.js', {debug:true})
    .transform('babelify', {
      presets: ['@babel/preset-env'],
      plugins: ['@babel/plugin-transform-runtime']
    })
    .bundle()
    .pipe(source('index.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest("dist"))
    .pipe(browsersync.stream());
}

function browserSync(done) {
    browsersync.init({
      server: {
        baseDir: "dist"
      },
      port: 3000
    });
     // watch(["./src/assets/**/*.*","./src/game/**/*.js","gulpfile.js"], browsersync.reload);
    done();
}

function watchIt(done) {
    watch(["./src/assets/**/*.*","./src/game/**/*.js","gulpfile.js"], series(html, assets, build));
    done();
}

if (process.env.NODE_ENV === 'production') {
  exports.build = build;
  exports.default = series(clean, html, assets, build);
} else {
  exports.build = build;
  exports.default = series(clean, parallel(html, assets, build), parallel(browserSync, watchIt));
}
