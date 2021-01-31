const { src, dest, watch, pipe, series, parallel, lastRun } = require('gulp');
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

const PHASERLIB = "node_modules/phaser/dist/phaser.min.js";

function clean () {
    return del(["dist"]);
}

function html(param) {
    return src("./assets/html/*.html")
        .pipe(dest("./dist"))
        .pipe(browsersync.stream());
}

function assets () {
    return src(["./assets/**/*","!./assets/html/*.html"])
        .pipe(dest("./dist/assets", {force:true}))
        .pipe(browsersync.stream());
}

function vendor() {
  return src([`${PHASERLIB}`])
      .pipe(dest("./dist"))
}


function build() {
  return browserify({
        entries: ["src/init.js"],
        debug: true,
    })
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

function buildProd() {
  return browserify({
        entries: ["src/init.js"],
        debug: false,
    })
    .transform('babelify', {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-transform-runtime']
    })
    .bundle()
    .pipe(source('index.min.js'))
    .pipe(buffer())
    .pipe(terser())
    .pipe(dest("dist"));
}

function browserSync(done) {
    browsersync.init({
      server: {
        baseDir: "dist"
      },
      port: 3000
    });
    done();
}

function watchIt(done) {
    watch(["./assets/**/*.*","./src/**/*.js","gulpfile.js"], parallel(html, vendor, assets, build));
    done();
}

exports.build = build;
exports.production = series(clean, html, vendor, assets, buildProd);
exports.default = series(clean, parallel(html, vendor, assets, build), parallel(browserSync, watchIt));
