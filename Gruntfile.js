module.exports = function(grunt) {

	grunt.initConfig({

		config: {
			testPort: 3000,
			livereloadPort: 3101,
			moduleName:'videojs.myTech',
			buildFolder: 'build',
			srcFolder: 'src',
			testFolder: 'www-test'
		},
		bower: {
			install: {
			  options: {
			    targetDir: './vendor',
			    layout: 'byComponent',
			    install: true,
			    verbose: false,
			    cleanTargetDir: true,
			    cleanBowerDir: true,
			    bowerOptions: {}
			  }
			}
		},

		babel: {
	        options: {
	            sourceMap: true,
	            modules:'umd',
	            moduleId:'TestView'
	        },
	        dist: {
	            files: {
	                '<%= config.buildFolder %>/module_babel.js': '<%= config.srcFolder %>/<%= config.moduleName %>.js'
	            }
	        }
	    },

		connect:{
			server:{
				options:{
					port: 3000,
			        hostname: '*',
			        open:true,
			        base: ['<%= config.testFolder %>','<%= config.buildFolder %>','.'],
			        livereload:'<%= config.livereloadPort %>'
				}
			}
		},
		watch:{
			files: ['<%= config.srcFolder %>/**/*.js','<%= config.testFolder %>/**/*.html'],
		    tasks: ['browserify'],
		    options: {
		      livereload: '<%= config.livereloadPort %>',
		    },
		},

		/**
	    *  Create UMD Module
	    */
	    browserify: {
	      module: {
	        options: {
			  standalone  : '<%= config.moduleName %>',
			  debug       : true
	        },
	        files:{
	          '<%= config.buildFolder %>/<%= config.moduleName %>.js':['<%= config.srcFolder %>/<%= config.moduleName %>.js'],
	        }
	      },
	    }
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-babel');

	grunt.registerTask('default',[ /*'bower', 'browserify',*/ 'connect', 'watch']);
}