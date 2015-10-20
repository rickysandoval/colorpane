var gulp = require('gulp');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var notify = require('gulp-notify');
var cssmin = require('gulp-cssmin');
var gutil = require('gulp-util');
var shell = require('gulp-shell');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
var dependencies = [
	'react',
	'react/addons',
	'flux',
	'object-assign'
];

var browserifyTask = function(options) {

	// App bundler
	var appBundler = browserify({
		entries: [options.src], // Just need initial file
		transform: [reactify], // Convert JSX
		debug: options.development, // Source mapping
		cache: {},
		packageCache: {},
		fullPaths: options.development // Requirement of watchify
	});

	// Set dependencies as externals on our app bundler when developing
	(options.development ? dependencies : []).forEach(function(dep) {
		appBundler.external(dep);
	});

	// Rebundle process
	var rebundle = function() {
		var start = Date.now();
		console.log('Building APP bundle');
		appBundler.bundle()
			.on('error', gutil.log)
			.pipe(source('main.js'))
			.pipe(gulpif(!options.development, streamify(uglify())))
			.pipe(gulp.dest(options.dest))
			.pipe(notify(function() {
				console.log('App bundle build in ' + (Date.now() - start) + 'ms');
			}));
	};

	// Fire up watchify when developing
	if (options.development) {
		appBundler = watchify(appBundler);
		appBundler.on('update', rebundle);
	}

	rebundle();

	// React-addons only for testing
	if (!options.development) {
		dependencies.splice(dependencies.indexOf('react-addons'), 1);
	}
	var vendorsBundler = browserify({
		debug: true,
		require: dependencies
	});

	// run the vendor bundle
	var start = new Date();
	console.log('Building Vendors bundle');
	vendorsBundler.bundle()
		.on('error', gutil.log)
		.pipe(source('vendors.js'))
		.pipe(gulpif(!options.development, streamify(uglify())))
		.pipe(gulp.dest(options.dest))
		.pipe(notify(function() {
			console.log('VENDORS bundle built in ' + (Date.now() - start) + 'ms');
		}));

	gulp.src('./img/*')
		.pipe(gulp.dest('./build/img'));
};

var cssTask = function(options) {
	if (options.development) {
		var run = function() {
			var start = new Date();
			console.log('Building css bundle');
			gulp.src(options.src)
				.pipe(sass().on('error', sass.logError))
				.pipe(gulp.dest(options.dest))
				.pipe(browserSync.stream())
				.pipe(notify(function() {
					console.log('CSS bundle built in ' + (Date.now() - start) + 'ms');
				}));
		};
		run();
		gulp.watch('./styles/sass/**/*.scss', run);
	} else {
		gulp.src(options.src)
		.pipe(sass().on('error', sass.logError))
		.pipe(cssmin())
		.pipe(gulp.dest(options.dest));
	}
};

gulp.task('default', function() {
	browserSync.init({
		server: './build',
		files: ['./build/*.js', './build/index.html'],
	});

	browserifyTask({
		development: true,
		src: './js/main.js',
		dest: './build'
	});

	cssTask({
		development: true,
		src: './styles/sass/main.scss',
		dest: './build'
	});
});

gulp.task('deploy', function() {
	browserifyTask({
		development: false,
		src: './js/main.js',
		dest: './dist'
	});

	cssTask({
		development: false,
		src: './styles/sass/main.scss',
		dest: './dist'
	});
});
