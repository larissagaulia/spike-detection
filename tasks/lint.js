// meta grunt task to run other linters.

module.exports = function (grunt) {
  'use strict';

  grunt.registerTask('lint', [
    'eslint'
  ]);
};
