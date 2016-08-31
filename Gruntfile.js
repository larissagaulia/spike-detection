module.exports = function (grunt) {
  'use strict';

  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: pkg,
    pkgReadOnly: pkg
  });
  // load all grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);
  // load local Grunt tasks
  grunt.loadTasks('tasks');
};
