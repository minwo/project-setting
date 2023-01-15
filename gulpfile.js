const gulp =         require('gulp');
const concat =       require('gulp-concat');
const fileinclude =  require('gulp-file-include');
const scss =         require('gulp-sass')(require('sass'));
const sourcemaps =   require('gulp-sourcemaps');
const clean =        require('gulp-clean');
const autoprefixer = require('gulp-autoprefixer');
const babel =        require('gulp-babel');
const dependents =   require('gulp-dependents');
const cached =       require('gulp-cached');
const browserSync =  require('browser-sync').create();

const src = './dev';
const www = './www';
const paths = {
    html : src + '/**/*.html',
    js : src + '/js/**/*.js',
    scss : src + ['/scss/**/*.scss'],
    img: src + '/images/**/*.*',
    fonts: src + '/fonts/**/*.*',
    include: src + '/include/*.html'
};

// clean
gulp.task('clean', () => {
    return gulp.src(www + '/*')
        .pipe(clean());
});

// html
gulp.task('html', () => {
    return gulp
        .src([paths.html, paths.include])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
		}))
		.pipe(cached('html'))
        .pipe(gulp.dest(www))
        .pipe(browserSync.stream());
});

// scss option
var scssOptions = {
    outputStyle: "compressed",
    indentType: "tab",
    indentWidth: 1,
    precision: 6,
    sourceComments: false
};

// scss
gulp.task('scss', () => {
    return gulp
		.src(paths.scss, { since: gulp.lastRun('scss') }) //불러오기
		.pipe(dependents())
        .pipe(sourcemaps.init())//소스맵 초기화
        .pipe(scss(scssOptions).on('error', scss.logError))
        // .pipe(concat('style.css')) //병합
        .pipe(autoprefixer())
        .pipe(sourcemaps.write()) //소스맵
        .pipe(gulp.dest(www + '/css')) //생성
        .pipe(browserSync.stream());
});

// js
gulp.task('js', () => {
    return gulp
		.src(paths.js, { since: gulp.lastRun('js') }) //불러오기
        .pipe(babel())
        .pipe(gulp.dest(www + '/js')) // 생성
        .pipe(browserSync.stream());

});

// img
gulp.task('img', () => {
    return gulp
		// .src(paths.img, { since: gulp.lastRun('img') }) //불러오기
		.src(paths.img) //불러오기
        .pipe(gulp.dest(www +'/images')) // 생성
        .pipe(browserSync.stream());

});

// fonts
gulp.task('fonts', () => {
    return gulp
        .src(paths.fonts) //불러오기
        .pipe(gulp.dest(www + '/fonts')) // 생성
        .pipe(browserSync.stream());

});

// browserSync
gulp.task('browserSync', () => {
    return new Promise(resolve => {
        browserSync.init(null, {
            port: 9999,
            server: {
                baseDir: 'www',
                index: "cl.html"
            },
            browser: "chrome"
        });
        resolve();
    });
});

const watch = () => {
    gulp.watch(paths.html, gulp.series('html'));
    gulp.watch(paths.js, gulp.series('js'));
    gulp.watch(paths.scss, gulp.series('scss'));
    gulp.watch(paths.img, gulp.series('img'));
};

gulp.task('default', gulp.series('clean', 'html', 'scss', 'js', 'img', 'fonts', 'browserSync', watch));