'use strict';

var gulp    = require('gulp'),
	connect = require('gulp-connect'),
	stylus  = require('gulp-stylus'),
	nib	    = require('nib'),
	jshint  = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
	historyApiFallback = require('connect-history-api-fallback');

//Servidor web de desarrollo
gulp.task('server', function() {
	connect.server ({
		root: './app',
		hostname: '0.0.0.0',
		port: 8080,
		livereload: true,
		middleware: function(connect, opt) {
			return [ historyApiFallback ];
		}
	});
});

//errores en el JS
gulp.task('jshint', function() {
	return gulp.src('./app/js/**/*.js')
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'));
}); 

//Preprocesa archivos de Stylus a CSS y recarga los cambios
gulp.task('css', function() {
	gulp.src('./app/css/estilos.styl')
	.pipe(stylus({ use: nib() }))
	.pipe(gulp.dest('./app/css'))
	.pipe(connect.reload());
});

//REcarga el navegador cuando hay cambios en el HTML
gulp.task('html', function() {
	gulp.src('./app/**/*.html') //Si cambiamos la ruta del index.html, se espesifica aqui la nueva ruta
		.pipe(connect.reload());
});

//Vigila cambios que se produzcan en el código y lanza las tareas relacionadas
gulp.task('watch', function() {
	gulp.watch(['./app/**/*.html'], ['html']);
	gulp.watch(['./app/css/**/*.styl'], ['css']);
	gulp.watch(['./app/js/**/*.js','./Gulpfile.js'], ['jshint']);
});

gulp.task('default', ['server', 'watch']);