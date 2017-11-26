var gulp            = require('gulp'),
    connect         = require('gulp-connect'),
    csslint         = require('gulp-csslint'),
    eslint          = require('gulp-eslint'),
    lintspaces      = require('gulp-lintspaces'),
    rename          = require('gulp-rename'),
    uglify          = require('gulp-uglify'),
    autoprefixer    = require('gulp-autoprefixer'),
    cleanCSS        = require('gulp-clean-css');

gulp.task('csslint', function() {
    return gulp.src('src/multilevelmenu.css')
        .pipe(csslint('.csslintrc'))
        .pipe(csslint.formatter());
});

gulp.task('copy:css', ['csslint'], function() {
    return gulp.src('src/multilevelmenu.css')
        .pipe(gulp.dest('docs/css/'));
});

gulp.task('minify:css', ['copy:css'], function() {
    return gulp.src('src/multilevelmenu.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9', 'Firefox ESR', 'Android >= 2.3'],
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(rename('multilevelmenu.min.css'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('editorconfig', function() {
    return gulp.src('src/multilevelmenu.js')
        .pipe(lintspaces({editorconfig: './.editorconfig'}))
        .pipe(lintspaces.reporter());
});

gulp.task('eslint', function() {
    return gulp.src('src/multilevelmenu.js')
        .pipe(eslint())
        .pipe(eslint.format())
        //.pipe(eslint.failAfterError());
});

gulp.task('copy:js', ['editorconfig', 'eslint'], function() {
    return gulp.src('src/multilevelmenu.js')
        .pipe(gulp.dest('docs/js/'));
});

gulp.task('minify:js', ['copy:js'], function() {
    return gulp.src('src/multilevelmenu.js')
        .pipe(uglify())
        .pipe(rename('multilevelmenu.min.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function() {
    gulp.watch([
        'docs/*.html',
        'src/**/*'
    ], ['build']);
});

gulp.task('serve', ['build', 'watch'], function() {
    connect.server({
        livereload: true
    });
});

gulp.task('build', ['minify:css', 'minify:js']);

gulp.task('default', ['build']);