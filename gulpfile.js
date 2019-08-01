'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var uncss = require('gulp-uncss');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var rigger = require('gulp-rigger');

gulp.task('sass', function () {
        gulp.src(['sass/style.scss', 'sass/others.scss'])
            //.pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            //.pipe(sourcemaps.write())
            .pipe(autoprefixer('last 2 version', 'ie 8', 'ie 9'))
            .pipe(concat('styles.min.css'))
            .pipe(minifyCSS({
                keepBreaks: false
             }))
            .pipe(gulp.dest('production'));
});

gulp.task('css', function () {
    gulp.src(['css/style.css'])
        .pipe(uncss({ html: [
            'index.html',
            'personal_area.html',
            'good.html',
            'category.html',
            'cart.html',
            'auth.html'
         ]}))
        .pipe(minifyCSS({
            keepBreaks: false
        }))
        .pipe(gulp.dest('production'))
});


gulp.task('sass:watch', function () {
    gulp.watch('sass/important/*.scss', ['sass']);
    gulp.watch('sass/important/*/*.scss', ['sass']);
    gulp.watch('sass/others/*.scss', ['sass']);
    gulp.watch('sass/*.scss', ['sass']);
});

gulp.task('js', function () {
    gulp.src(['js/dom_ready/*.js'])
        .pipe(concat('dom_ready.js'))
        .pipe(gulp.dest('js'));

    gulp.src(['js_noset/jquery.js', 'js/libs/*.js', 'js/*.js'])
       .pipe(uglify().on('error', function(e){
            console.log(e);
        }))
        .pipe(concat('scripts.min.js'))
        .pipe(gulp.dest('production'));

    gulp.src([
        'js/minimal_dom_ready/*.js',
        'js/dom_ready/menu.js',
        'js/dom_ready/_loader.js',
        'js/dom_ready/_modal.js',
        'js/dom_ready/start.js',
    ])
        .pipe(concat('dom_ready_minimal.js'))
        .pipe(gulp.dest('js'));

    gulp.src([
        'js_noset/jquery.js',
        'js/libs/in-view.min.js',
        'js/_form_validator.js',
        'js/_loader.js',
        'js/dom_ready_minimal.js',
        'js_noset/slide_article.js'
    ])
        .pipe(uglify().on('error', function(e){
            console.log(e);
        }))
        .pipe(concat('minimal.min.js'))
        .pipe(gulp.dest('production'));

});
gulp.task('js:watch', function () {
    gulp.watch('js/dom_ready/*.js', ['js']);
});

gulp.task('clean', function() {
    return gulp.src(['production'], {read: false})
        .pipe(clean());
});

gulp.task('html', function () {
    gulp.src(['pages/*.html'])
        .pipe(rigger())
        .pipe(gulp.dest(''));
});
gulp.task('html:watch', function () {
    gulp.watch(['pages/*.html'], ['html']);
});

gulp.task('default', ['clean'], function() {
    gulp.start('html:watch', 'sass:watch', 'js:watch', 'sass', 'js');
});