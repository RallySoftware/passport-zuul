'use strict';

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          globals: [],
          ui: 'bdd'
        },
        src: ['test/**/*.coffee']
      }
    },
    coffeelint: {
      options: {
        no_tabs: {level: 'ignore'},
        max_line_length: {level: 'ignore'},
        indentation: {level: 'warn'}
      },
      lib: {
        src: ['src/**/*.coffee']
      },
      test: {
        src: ['test/**/*.coffee']
      }
    },
    coffee: {
      compile: {
        files: grunt.file.expandMapping(['**/*.coffee'],'lib/',{
          rename: function(destBase,destPath) {
            return destBase+destPath.replace(/\.coffee$/,".js");
          },
          cwd: 'src'
        })
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('dist', ['coffeelint', 'mochaTest', 'coffee']);
  grunt.registerTask('test', ['coffeelint', 'mochaTest']);
  grunt.registerTask('default', ['coffeelint', 'mochaTest']);
  
};
