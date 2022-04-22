module.exports = function(grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      ts: {
        default : {
          tsconfig: './tsconfig.json'
        },
        node : {
          tsconfig: './tsconfig_node.json'
        },
        options: {
          // fast: 'never'
        }
      },

      browserify: {
        dist: {
          options: {
             transform: [
               ['babelify']
              ],
             browserifyOptions: {
                standalone: "<%= pkg.name %>",
                debug: true
            }
          },
          src: ['dist/index.js'],
          dest: 'bundle/<%= pkg.name %>.js',
        }
      },

      copy: {
        main: {
          src: 'bundle/<%= pkg.name %>.js',
          dest: '../main/source/resource/<%= pkg.name %>.js',
        }
      }
    });

    // load tasks
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-copy');

    // setup sequence of tasks
    grunt.registerTask('default', ['ts:default']);
    grunt.registerTask('browser', ['default', 'browserify', 'copy']);
    grunt.registerTask('node', ['ts:node']);
};