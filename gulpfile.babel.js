// LIBRARIES
// - - - - - - - - - - - - - - -
import gulp from 'gulp';
import paths from './projectpath.babel';
import stylish from 'jshint-stylish';
import loadPlugins from 'gulp-load-plugins';
import path from 'path';
import del from 'del';

const eslint = require('gulp-eslint')
const mocha = require('gulp-mocha')
const nodemon = require('gulp-nodemon')
const browserSync = require('browser-sync').create()
const webpack = require('webpack')
const imagemin = require('gulp-imagemin')

const plugins = loadPlugins();

const PROJECT_DIR = path.resolve(__dirname)

const NODEMON_PORT = 4000
const NODEMON_ENV = 'development'
const BROWSERSYNC_PORT = 4001;


const IMG_FILES = [
  './frontend/images/**/*'
]

const SASS_VENDOR_PATHS = [
  require("bourbon-neat").includePaths,

]

const SASS_FILES = [
  `${PROJECT_DIR}/frontend/styles/**/*.scss`,
  `${PROJECT_DIR}/frontend/components/**/*.scss`
  // new components
  // `${PROJECT_DIR}/frontend/components/**/styles/`,
]
const VENDOR_FILES = [
  `${PROJECT_DIR}/frontend/vendor/**/*`,
  'node_modules/prismjs/themes/*.css'
]

const JS_FILES = [
  `${PROJECT_DIR}/frontend/scripts/**/*.js`,
  `${PROJECT_DIR}/frontend/components/**/scripts/*.js`
]

const JS_WATCH_FILES = [
  `${PROJECT_DIR}/webpack.config.js`
].concat(JS_FILES)

const JS_TEST_FILES = [
  `${PROJECT_DIR}/tests/**/test.*.js`
]

const JS_TEST_WATCH_FILES = JS_TEST_FILES.concat(JS_WATCH_FILES)
const webpackConfig = require('./webpack.config.js')

var lintPaths = [
  'frontend/scripts/**/*.js',
  'backend/**/*.js',
  'tests/unit/spec/**/*.js',
  'gulpfile.js'
]

// TASKS
// - - - - - - - - - - - - - - -
gulp.task('browser-sync', ['clean','build','nodemon'], function() {
	return browserSync.init(null, {
		proxy: `http://localhost:${NODEMON_PORT}`,
    files: ["static/**/*.*", 'backend/**/*.*'],
    browser: "google chrome",
    port: BROWSERSYNC_PORT,
    reloadDelay: 2000
	});
});

gulp.task('nodemon', function (cb) {

	var started = false;

	return nodemon({
		script: 'index.js',
    watch:[
      // 'backend/_api/**/*.*',
      // 'backend/routes/**/*.*',
      // '_server/**/*.*',
      'backend/views/**/*.*',
      // 'backend/appController.js',
      // 'Constants.js',
      'index.js'
    ],
    env:{
      PORT:NODEMON_PORT,
      NODE_ENV:NODEMON_ENV
    },
    ext: 'js pug',
    nodeArgs:['--inspect']
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true;
		}
	});
});

// gulp.task('sass', () => gulp
//     .src(SASS_FILES)
//     .pipe(plugins.sass({
//       outputStyle: 'compressed',
//       includePaths: [
//         SASS_VENDOR_PATHS
//       ]
//     }))
//     .pipe(gulp.dest(paths.styles.dest))
// );


gulp.task('images', ['clean'], function () {
    return gulp.src(IMG_FILES)
      .pipe(plugins.imagemin({verbose:true}))
      .pipe(gulp.dest('./static/images'));
});
gulp.task('images:dev', function () {
    return gulp.src(IMG_FILES)
      .pipe(plugins.imagemin({verbose:true}))
      .pipe(gulp.dest('./static/images'));
});

// Watch for changes and re-run tasks
gulp.task('watchForChanges', function() {
    gulp.watch(SASS_FILES, ['sass:dev']);
    gulp.watch(JS_WATCH_FILES, ['webpack:dev'])
});


gulp.task('lint:sass', () => gulp
    .src([
        SASS_FILES
    ])
    .pipe(plugins.sassLint({
        rules: {
            'no-mergeable-selectors': 1, // Severity 1 (warning)
            'pseudo-element': 0,
            'no-ids': 0,
            'mixins-before-declarations': 0,
            'no-duplicate-properties': 0,
            'no-vendor-prefixes': 0,
            'single-line-per-selector': 0
        }
    }))
    .pipe(plugins.sassLint.format(stylish))
    .pipe(plugins.sassLint.failOnError())
);


gulp.task('lint',
    ['lint:sass']
);

gulp.task('js:lint', function () {
  return gulp.src(lintPaths)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('js:test', ['js:lint'], function (done) {
  return gulp.src(JS_TEST_FILES)
    .pipe(mocha({
      compilers: [
        'js:babel-core/register'
      ]
    }))
})

gulp.task('js:test:watch', function () {
  return gulp.watch(JS_TEST_WATCH_FILES, ['js:test'])
})

gulp.task('webpack', ['clean', 'js:lint', 'js:test'], function (callback) {
  // run webpack
  return webpack(webpackConfig, function (err, stats) {
    if (err) {
      throw new plugins.util.PluginError('webpack', err)
    }
    plugins.util.log('[webpack]', stats.toString({
      // output options
    }))
    callback()
  })
})

gulp.task('webpack:dev', ['js:lint', 'js:test'], function (callback) {
  // run webpack
  return webpack(webpackConfig, function (err, stats) {
    if (err) {
      throw new plugins.util.PluginError('webpack', err)
    }
    plugins.util.log('[webpack]', stats.toString({
      // output options
    }))
    callback()
  })
})

gulp.task('sass', ['clean'], function () {
  return gulp.src(SASS_FILES)
    .pipe(plugins.sass({
      includePaths: SASS_VENDOR_PATHS,
      outputStyle: 'compressed'
    }).on('error', plugins.sass.logError))
    .pipe(gulp.dest('./static/styles'))
})

gulp.task('sass:dev', function () {
  // console.log(SASS_FILES);
  return gulp.src(SASS_FILES)
    .pipe(plugins.sass({
      includePaths: SASS_VENDOR_PATHS,
      outputStyle: 'expanded'
    }).on('error', plugins.sass.logError))
    .pipe(gulp.dest('./static/styles'))
})

gulp.task('vendor_assets', ['clean'], function () {
  return gulp.src(VENDOR_FILES)
    .pipe(gulp.dest('./static/vendor/'))
})

gulp.task('clean', function () {
  return del(['static/**/', 'static/*.*', '!static/robots.txt', '!static/sitemap.xml'])
})

// Default: compile everything
gulp.task('default',
    ['build', 'watch', 'browser-sync']
);

gulp.task('build', ['clean', 'js:test', 'vendor_assets', 'sass', 'webpack', 'images'])

// Optional: recompile on changes
gulp.task('watch',
    ['watchForChanges']
);
