'use strict';

let gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglifyes'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

    let path = {
        build: { //Тут мы укажем куда складывать готовые после сборки файлы
          html: 'docs/',
          js: 'docs/js/',
          css: 'docs/css/',
          img: 'docs/images/',
          fonts: 'docs/fonts/',
          root: 'docs/',
          shadowCSS: 'docs/shadowCSS/',
          language: 'docs/language/'
        },
        src: { //Пути откуда брать исходники
          html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
          js: 'src/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
          style: 'src/scss/main.scss',
          img: 'src/images/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
          fonts: 'src/fonts/**/*.*',
          root: 'src/*.*',
          shadowCSS: 'src/shadowCSS/*.css',
          language: 'src/language/*.*'
        },
        watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
          html: 'src/**/*.html',
          js: 'src/js/**/*.js',
          style: 'src/scss/**/*.scss',
          img: 'src/images/**/*.*',
          fonts: 'src/fonts/**/*.*',
          shadowCSS: 'src/shadowCSS/*.css',
          language: 'src/language/*.*'
        },
        clean: './docs'
  };

  let config = {
      server: {
          baseDir: "./docs"
      },
      tunnel: false,
      host: 'localhost',
      port: 9000,
      logPrefix: "Frontend"
};

gulp.task('html:build', async function () {
  gulp.src(path.src.html) //Выберем файлы по нужному пути
      .pipe(rigger()) //Прогоним через rigger
      .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
      .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('js:build', async function () {
  gulp.src(path.src.js) //Найдем наш main файл
      .pipe(rigger()) //Прогоним через rigger
      .pipe(sourcemaps.init()) //Инициализируем sourcemap
      .pipe(uglify({ 
        mangle: false, 
        ecma: 6 
      })) //Сожмем наш js
      .pipe(sourcemaps.write()) //Пропишем карты
      .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
      .pipe(reload({stream: true})); //И перезагрузим сервер
});

gulp.task('style:build', async function () {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass().on('error', sass.logError)) //Скомпилируем
        .pipe(prefixer('last 2 versions')) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', async function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(reload({stream: true}));
});

gulp.task('root:build', async function() {
  gulp.src(path.src.root)
      .pipe(gulp.dest(path.build.root))
      .pipe(reload({stream: true}));
});

gulp.task('shadowCSS:build', async function() {
  gulp.src(path.src.shadowCSS)
      .pipe(prefixer('last 2 versions')) //Добавим вендорные префиксы
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.build.shadowCSS))
      .pipe(reload({stream: true}));
});

gulp.task('lang:build', async function() {
  gulp.src(path.src.language)
      .pipe(gulp.dest(path.build.language))
      .pipe(reload({stream: true}));
});


//compressing all images

let cache = require('gulp-cache');
let imageminPngquant = require('imagemin-pngquant');
let imageminZopfli = require('imagemin-zopfli');
let imageminMozjpeg = require('imagemin-mozjpeg'); //need to run 'brew install libpng'

gulp.task('image:build', async function() {
  return gulp.src(path.src.img)
      .pipe(cache(imagemin([
          //png
          imageminPngquant({
              speed: 1,
              quality: [0.95, 1] //lossy settings
          }),
          imageminZopfli({
              more: true
              // iterations: 50 // very slow but more effective
          }),
          //gif
          imagemin.gifsicle({
            interlaced: true,
            optimizationLevel: 3
          }),

          //svg
          imagemin.svgo({
              plugins: [{
                  removeViewBox: false
              }]
          }),
          //jpg lossless
          imagemin.jpegtran({
              progressive: true
          }),
          //jpg very light lossy, use vs jpegtran
          imageminMozjpeg({
              quality: 90
          })
      ])))
      .pipe(gulp.dest(path.build.img)); //И бросим в build
});

gulp.task('build', gulp.series( 
  'html:build',
  'js:build',
  'style:build',
  'fonts:build',
  'root:build',
  'lang:build',
  'shadowCSS:build',
  'image:build'
));

gulp.task('watch', function(done){
  gulp.watch([path.watch.html], gulp.series('html:build')),
  gulp.watch([path.watch.style], gulp.series('style:build')),
  gulp.watch([path.watch.js], gulp.series('js:build')),
  gulp.watch([path.watch.img], gulp.series('image:build')),
  gulp.watch([path.watch.fonts], gulp.series('fonts:build')),
  gulp.watch([path.watch.shadowCSS], gulp.series('shadowCSS:build')),
  gulp.watch([path.watch.language], gulp.series('lang:build'))
  done();
});

gulp.task('webserver', function () {
  browserSync(config);
});

gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

gulp.task('default', gulp.parallel('build', 'webserver', 'watch'));