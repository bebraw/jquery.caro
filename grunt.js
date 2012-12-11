/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.7.2',
      banner: '/*! caro.js - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* http://bebraw.github.com/caro.js/\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Juho Vepsalainen; Licensed MIT */'
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>',
              'src/jquery.caro.js'],
        dest: 'dist/jquery.caro.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/jquery.caro.min.js'
      }
    },
    watch: {
      files: 'src/**/*.js',
      tasks: 'concat min'
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'concat min');

};
