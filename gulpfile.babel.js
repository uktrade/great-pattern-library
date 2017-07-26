// LIBRARIES
// - - - - - - - - - - - - - - -
import gulp from 'gulp'
import loadPlugins from 'gulp-load-plugins'
import path from 'path'
import del from 'del'

const browserSync = require('browser-sync').create()
const webpack = require('webpack')
const plugins = loadPlugins()

const PROJECT_DIR = path.resolve(__dirname)
const NODEMON_PORT = 4000
const NODEMON_ENV = 'development'
const BROWSERSYNC_PORT = 4001

const HEADER_FOOTER_FILES = [
  `${PROJECT_DIR}/shared-header-footer/*`
]
const HEADER_FOOTER_SASS = [
  `${PROJECT_DIR}/shared-header-footer-sass/*`
]

const IMG_FILES = [
  './frontend/images/**/*.*{jpg,jpeg,png,svg,bmp}'
]

const SASS_VENDOR_PATHS = [].concat(require('bourbon-neat').includePaths)

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

var jsLintPaths = [
  'frontend/scripts/**/*.js',
  'backend/**/*.js',
  'tests/unit/spec/**/*.js',
  'gulpfile.babel.js'
]

// TASKS
// - - - - - - - - - - - - - - -
gulp.task('browser-sync', ['clean', 'build', 'nodemon'], function () {
  return browserSync.init(null, {
    proxy: `http://localhost:${NODEMON_PORT}`,
    files: ['static/**/*.*', 'backend/**/*.*'],
    browser: 'google chrome',
    port: BROWSERSYNC_PORT,
    reloadDelay: 2000
  })
})

gulp.task('nodemon', function (cb) {
  var started = false

  return plugins.nodemon({
    script: 'index.js',
    watch: [
      'backend/views/**/*.*',
      'index.js'
    ],
    env: {
      PORT: NODEMON_PORT,
      NODE_ENV: NODEMON_ENV
    },
    ext: 'js pug',
    nodeArgs: ['--inspect']
  }).on('start', function () {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb()
      started = true
    }
  })
})

gulp.task('images', ['clean'], function () {
  return gulp.src(IMG_FILES)
    .pipe(plugins.imagemin({verbose: true}))
    .pipe(gulp.dest('./static/images'))
})
gulp.task('images:dev', function () {
  return gulp.src(IMG_FILES)
    .pipe(plugins.imagemin({verbose: true}))
    .pipe(gulp.dest('./static/images'))
})

// Watch for changes and re-run tasks
gulp.task('watchForChanges', function () {
  gulp.watch(SASS_FILES, ['sass:dev'])
  gulp.watch(JS_WATCH_FILES, ['webpack:dev'])
  gulp.watch(IMG_FILES, ['images:dev'])
  gulp.watch(HEADER_FOOTER_FILES, ['header-footer:dev'])
  gulp.watch(HEADER_FOOTER_SASS, ['header-footer:sass-dev'])
})

gulp.task('lint:sass', () => gulp
    .src(SASS_FILES)
    .pipe(plugins.sassLint({
      rules: {
        'force-pseudo-nesting': 0
      }}))
    .pipe(plugins.sassLint.format())
    .pipe(plugins.sassLint.failOnError())
)

gulp.task('lint:hf-sass', () => gulp
    .src(HEADER_FOOTER_SASS)
    .pipe(plugins.sassLint())
    .pipe(plugins.sassLint.format())
    .pipe(plugins.sassLint.failOnError())
)

gulp.task('lint',
    ['lint:sass', 'lint:js']
)

gulp.task('lint:js', function () {
  return gulp.src(jsLintPaths)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError())
})

gulp.task('js:test', ['lint:js'], function (done) {
  return gulp.src(JS_TEST_FILES)
    .pipe(plugins.mocha({
      compilers: [
        'js:babel-core/register'
      ]
    }))
})

gulp.task('js:test:watch', function () {
  return gulp.watch(JS_TEST_WATCH_FILES, ['js:test'])
})

gulp.task('webpack', ['clean', 'lint:js', 'js:test'], function (callback) {
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

gulp.task('webpack:dev', ['lint:js', 'js:test'], function (callback) {
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

gulp.task('sass', ['clean', 'lint'], function () {
  return gulp.src(SASS_FILES)
    .pipe(plugins.sass({
      includePaths: SASS_VENDOR_PATHS,
      outputStyle: 'compressed'
    }).on('error', plugins.sass.logError))
    .pipe(gulp.dest('./static/styles'))
})

gulp.task('sass:dev', ['lint'], function () {
  return gulp.src(SASS_FILES)
    .pipe(plugins.sass({
      includePaths: SASS_VENDOR_PATHS,
      outputStyle: 'compressed'
    }).on('error', plugins.sass.logError))
    .pipe(gulp.dest('./static/styles'))
})

gulp.task('vendor_assets', ['clean'], function () {
  return gulp.src(VENDOR_FILES)
    .pipe(gulp.dest('./static/vendor/'))
})

// Simply copy over all the header/footer files so we can demo
gulp.task('header-footer', ['clean'], function () {
  return gulp.src(HEADER_FOOTER_FILES)
    .pipe(gulp.dest('./static/shared-header-footer'))
})
// watch for changes
gulp.task('header-footer:dev', function () {
  return gulp.src(HEADER_FOOTER_FILES)
    .pipe(gulp.dest('./static/shared-header-footer'))
})
// Compile header/footer sass
gulp.task('header-footer:sass', ['clean', 'lint:hf-sass'], function () {
  return gulp.src(HEADER_FOOTER_SASS)
    .pipe(plugins.sass({
      outputStyle: 'compressed'
    }).on('error', plugins.sass.logError))
    .pipe(gulp.dest('./static/shared-header-footer'))
    .pipe(gulp.dest('./shared-header-footer'))
})
// Watch for sass changes and update in static folder AND shared-header-footer
gulp.task('header-footer:sass-dev', ['lint:hf-sass'], function () {
  return gulp.src(HEADER_FOOTER_SASS)
    .pipe(plugins.sass({
      outputStyle: 'compressed'
    }).on('error', plugins.sass.logError))
    .pipe(gulp.dest('./static/shared-header-footer'))
    .pipe(gulp.dest('./shared-header-footer'))
})

gulp.task('clean', function () {
  return del(['static/**/', 'static/*.*', '!static/robots.txt', '!static/sitemap.xml'])
})

// Default: compile everything
gulp.task('default',
    ['build', 'watch', 'browser-sync']
)

gulp.task('build', ['clean', 'js:test', 'vendor_assets', 'sass', 'webpack', 'images', 'header-footer', 'header-footer:sass'])

// Optional: recompile on changes
gulp.task('watch',
    ['watchForChanges']
)
