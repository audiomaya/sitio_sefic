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

var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;

//Busca en las carpetas de estilos yjavascript los archivos que hayamos creado
//para inyectarlos en el index.html
gulp.task('inject', function() {
	var sources = gulp.src(['./app/js/**/*.js','./app/css/**/*.css']);
	return gulp.src('index.html', {cwd: './app'})
		.pipe(inject(sources, {
			read: false,
			ignorePath: '/app'
		}))
		.pipe(gulp.dest('./app'));
});

//Inyecta las librerias que instalemos vía Bower
gulp.task('wiredep', function () {
	gulp.src('./app/index.html')
		.pipe(wiredep({
			directory: './app/lib'
		}))
		.pipe(gulp.dest('./app'));
});

//Vigila cambios que se produzcan en el código y lanza las tareas relacionadas
gulp.task('watch', function() {
	gulp.watch(['./app/js/**/*.html'], ['html']);
	gulp.watch(['./app/css/**/*.styl'], ['css', 'inject']);
	gulp.watch(['./app/js/**/*.js','./Gulpfile.js'], ['jshint', 'inject']);
	gulp.watch(['./bower.json'], ['wiredep']);
});

gulp.task('default', ['server', 'inject', 'wiredep', 'watch']);