'use strict';

var gulp = require('gulp');
var minifyJs = require('gulp-minify');
var cleanCSS = require('gulp-clean-css');
var gulpCssDataUri = require('gulp-css-base64');
var rename = require('gulp-rename');
var del = require('del');
var runSequence = require('run-sequence');
var replace = require('gulp-string-replace');
var pjson = require('./package.json');

gulp.task('clean', function () {
    return del(['dist']);
});

gulp.task('build-js', function () {
    return gulp.src('./src/*.js')
        .pipe(minifyJs({
            noSource: true,
            ext: {
                min: '.min.js'
            },
            preserveComments: 'some',
            exclude: ['tasks']
        }))
        .pipe(replace(new RegExp('@version@', 'g'), pjson.version))
        .pipe(gulp.dest('dist'));
});

gulp.task('build-css', function () {
    return gulp.src('./src/*.css')
        .pipe(cleanCSS({
            inline: 'local',
            compatibility: 'ie9',
            specialComments: true
        }))
        .pipe(gulpCssDataUri({
            //baseDir: "src/img",
            extensionsAllowed: ['.gif', '.png', '.svg']
        }))
        .pipe(replace(new RegExp('@version@', 'g'), pjson.version))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', function (callback) {
    runSequence(
        'clean',
        'build-js',
        'build-css',
        callback
    );
});
