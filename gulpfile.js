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
    cache = require('gulp-cache'),
    del = require('del'),
    connect = require('gulp-connect'),
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
        .pipe(connect.reload());
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
        .pipe(connect.reload());
});

gulp.task('images', function () {
    return gulp.src('./img/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true,
            svgoPlugins: [{removeViewBox: false}]
        })))
        .pipe(gulp.dest(config.images));
});

gulp.task('connect', function() {
    connect.server({
        root: './',
        port: 8888,
        livereload: true
    });
});

// Run "gulp clean" to remove the build folder
gulp.task('clean', function() {
    del([config.destination], function (err) {
        console.log(config.destination + ' folder deleted');
    });
});

gulp.task('watch', function () {
    gulp.watch('scss/**/*.scss', ['styles']);
    gulp.watch('js/*.js', ['scripts']);
});

gulp.task('default', ['styles', 'scripts', 'images', 'connect', 'watch'], function() {
});