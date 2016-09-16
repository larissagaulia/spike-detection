module.exports = function (grunt) {
  'use strict';

  grunt.config('eslint', {
    app: {
      eslintrc: '.eslintrc',
      src: ['Gruntfile.js', 'tasks/*.js', 'scripts/*.js', 'lib/*.js']
    },
    test: {
      eslintrc: '.eslintrc',
      src: [
        'test/*.js'
      ]
    }
  });
};
