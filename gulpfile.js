var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    rename = require("gulp-rename"),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    notify = require("gulp-notify"),
    cache = require('gulp-cache'),
    del = require('del'),
    livereload = require('gulp-livereload'),
    config = {
        destination: 'build',
        port: 9000,
        scripts: function () {
            return config.destination + '/js';
        },
        styles: function () {
            return config.destination + '/css';
        },
        images: function () {
            return config.destination + '/img';
        }
    };

gulp.task('styles', function() {
    gulp.src('./scss/*.scss')
        .pipe(plumber())
        .pipe(sass({
            style: 'expanded'
        }))
        .pipe(autoprefixer({
            browsers: ['last 3 versions']
        }))
        .pipe(gulp.dest(config.styles))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest(config.styles))
        .pipe(notify("Styles compilation successful"));
});

gulp.task('scripts', function() {
    gulp.src(['./js/main.js'])
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(config.scripts))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(config.scripts))
        .pipe(notify("Scripts compilation successful"));
});

gulp.task('images', function () {
    return gulp.src('./img/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true,
            svgoPlugins: [{removeViewBox: false}]
        })))
        .pipe(gulp.dest(config.images))
        .pipe(notify("Images minified"));
});

// Run "gulp clean" to remove the build folder
gulp.task('clean', function() {
    del([config.destination], function (err) {
        console.log('Files deleted');
    });
});

gulp.task('watch', function () {
    gulp.watch('scss/**/*.scss', ['styles']);
    gulp.watch('js/*.js', ['scripts']);
});

gulp.task('default', ['styles', 'scripts', 'images', 'watch'], function() {
});