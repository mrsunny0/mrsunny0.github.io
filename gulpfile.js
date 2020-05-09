const
gulp = require('gulp'),
csso = require('gulp-csso'),
// var uglify = require('gulp-uglify');
// var uglify = require('gulp-uglify-es').default;
terser = require('gulp-terser'),
concat = require('gulp-concat'),
sass = require('gulp-sass'),
plumber = require('gulp-plumber'),
cp = require('child_process'),
imagemin = require('gulp-imagemin'),
browserSync = require('browser-sync')

var jekyllCommand = (/^win/.test(process.platform)) ? 'jekyll.bat' : 'bundle';

/*
 * Build the Jekyll Site
 * runs a child process in node that runs the jekyll commands
 */
gulp.task('jekyll-build', async function (done) {
	return cp.spawn(jekyllCommand, ['exec', 'jekyll', 'build'], {stdio: 'inherit'}).on('close', done);
});

/*
 * Rebuild Jekyll & reload browserSync
 */
gulp.task('jekyll-rebuild', gulp.series('jekyll-build', function () {
	browserSync.reload();
}));

/*
 * Build the jekyll site and launch browser-sync
 */
gulp.task('browser-sync', gulp.series('jekyll-build', function() {
	browserSync({
		server: {
			baseDir: '_site'
		}
	});
}));

/*
* Compile and minify sass
*/
gulp.task('sass', async function() {
  	gulp.src('src/styles/**/*.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(csso())
		.pipe(gulp.dest('assets/css/'));
});

/*
* Compile fonts
*/
gulp.task('fonts', async function() {
	gulp.src('src/fonts/**/*.{ttf,woff,woff2}')
		.pipe(plumber())
		.pipe(gulp.dest('assets/fonts/'));
})

/*
 * Minify images
 */
gulp.task('imagemin', async function() {
	return gulp.src('src/img/**/*.{jpg,png,gif}')
		.pipe(plumber())
		.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
		.pipe(gulp.dest('assets/img/'));
});

/**
 * Compile and minify js
 */
gulp.task('js', async function(){
	return gulp.src('src/js/**/*.js')
		.pipe(plumber())
		.pipe(concat('main.js'))
		.pipe(terser())
		.pipe(gulp.dest('assets/js/'))
});

gulp.task('watch', function() {
	gulp.watch('src/styles/**/*.scss', ['sass', 'jekyll-rebuild']);
	gulp.watch('src/js/**/*.js', ['js']);
	gulp.watch('src/fonts/**/*.{tff,woff,woff2}', ['fonts']);
	gulp.watch('src/img/**/*.{jpg,png,gif}', ['imagemin']);
	gulp.watch(['*html', '_includes/*html', '_layouts/*.html'], ['jekyll-rebuild']);
});

gulp.task('default',
	gulp.series(
		gulp.parallel('js', 'sass', 'fonts'),
		'browser-sync',
		'watch',
	)
)
