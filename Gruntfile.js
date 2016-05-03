/*global module:false*/
module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

        compass: {
            desktop_dev: {
                options: {
                    sassDir: 'app/views/desktop/scss',
                    cssDir: 'public/assets/desktop',
                    specify: 'app/views/desktop/scss/init.scss',
                    outputStyle: 'compact'
                }
            }
        },

        concat: {
            js: {
                src: [
                    'public/bower_components/jquery/dist/jquery.js',
                    'public/bower_components/jquery-ui/ui/jquery-ui.js',
                    'public/javascripts/lib/jquery.ui.touch-punch.js',
                    'public/javascripts/lib/toastr.js',
                    'public/javascripts/lib/underscore.js',
                    'public/javascripts/lib/clearsearch.js',
                    'public/bower_components/knockout/dist/knockout.js',
                    'public/javascripts/lib/knockout-mapping-2.4.1.js',
                    'public/javascripts/lib/knockout.validation-1.0.2.js',
                    'public/bower_components/pickadate/lib/compressed/picker.js',
                    'public/bower_components/pickadate/lib/compressed/picker.date.js',
                    'public/bower_components/nouislider/Link.js',
                    'public/bower_components/nouislider/jquery.nouislider.js',
                    'public/bower_components/moment/moment.js',
                    'public/bower_components/fastclick/lib/fastclick.js',
                    'public/bower_components/underscore.string/lib/underscore.string.js',
                    'public/bower_components/knockout-postbox/build/knockout-postbox.js',
                    'public/bower_components/query-string/query-string.js',
                    'public/bower_components/jquery-autosize/jquery.autosize.js',
                    'public/bower_components/jquery-color-animation/jquery.animate-colors-min.js',
                    'public/bower_components/accounting.js/accounting.min.js',
                    'public/bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
                    'public/javascripts/config/knockout_config.js',
                    'public/assets/main.js',
                    'public/javascripts/bindings/save_button.js',
                    'public/javascripts/bindings/date_picker.js',
                    'public/javascripts/bindings/inline_editable.js',
                    'public/javascripts/bindings/inline_editable_text.js',
                    'public/javascripts/bindings/inline_editable_expandable_text.js',
                    'public/javascripts/bindings/inline_editable_calendar.js',
                    'public/javascripts/bindings/expandable_textarea.js',
                    'public/javascripts/bindings/probability_slider.js',
                    'public/javascripts/bindings/section_slider.js',
                    'public/javascripts/bindings/section_active.js',
                    'public/javascripts/bindings/date.js',
                    'public/javascripts/bindings/percentage.js',
                    'public/javascripts/bindings/mutiple_data_popover.js',
                    'public/javascripts/bindings/popover_table.js',
                    'public/javascripts/bindings/read_more_or_less.js',
                    'public/javascripts/bindings/numeric.js',
                    'public/javascripts/bindings/batch_edit_calendar.js',
                    "public/javascripts/bindings/change_title.js",
                    'public/javascripts/extenders/round_down_to_nearest.js',
                    'public/javascripts/browser_hacks/preload_images.js',
                    '!public/javascripts/main.js'
                ],
                dest: 'public/assets/app.min.js'
            }
        },
        uglify: {
            dist: {
                src: '<%= concat.js.dest %>',
                dest: '<%= concat.js.dest %>'
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                jshintrc: true
            },
            all: ['Gruntfile.js',
                'public/javascripts/**/*.js',
                '!public/javascripts/lib/**/*.js',
            ]
        },
        qunit: {
            files: ['test/**/*.html']
        },
        watch: {
            sass: {
                files: ['app/views/**/scss/**/*.scss'],
                tasks: ['compass:mobile_dev', 'concat:mobile_css', 'compass:desktop_dev', 'concat:desktop_css',]
            },
            css: {
                files: ['public/assets/**/*.css'],
                options: { livereload: true }
            },
            js: {
                files: ['public/javascripts/**/*.js'],
                tasks: ['browserify'],
                options: {
                    livereload: true
                }
            }
        },
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            dev: {
                singleRun: false,
                reporter: 'dots'
            },
            ci: {
                singleRun: true
            }
        },

        shell: {
            thin: {
                options: {
                    stdout: true,
                    stderr: true
                },
                command: 'bundle exec rake -f ./Rakefile_on_env aws:store_aws_key && bundle exec thin start -p 9393'
            },
            rakeTests: {
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true
                },
                command: 'bundle exec rake'
            },
            functionalTest: {
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true
                },
                command: 'bundle exec rake test:functional'
            }
        },

        concurrent: {
            development: {
                options: {
                    logConcurrentOutput: true
                },
                tasks: ['watch', 'shell:thin']
            }
        },

        browserify: {
            options: {
                bundleOptions: {
                    debug: true,
                    standalone: 'salesFunnel'
                }
            },
            development: {
                files: {
                    'public/assets/main.js': ['public/javascripts/main.js']
                }
            }
        },

        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: 'timestamp',
                            replacement: '<%= new Date().getTime() %>'
                        }
                    ]
                },
                files: [
                    {src: ['app/views/desktop/layout.slim'], dest: 'app/views/desktop/layout.slim'},
                    {src: ['app/views/mobile/layout.slim'], dest: 'app/views/mobile/layout.slim'}
                ]
            }
        }
    });
    // Default task.
    grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
    grunt.registerTask('buildAssets', ['fontAwesomeVars', 'compass:mobile_dist', 'compass:desktop_dist', 'browserify', 'concat', 'uglify']);
    grunt.registerTask('development', ['fontAwesomeVars', 'compass:mobile_dev', 'compass:desktop_dev', 'browserify', 'concat', 'concurrent:development']);
    grunt.registerTask('dev', ['development']);
    grunt.registerTask('runAllTests', ['buildAssets', 'jshint', 'shell:rakeTests', 'karma:ci']);
    grunt.registerTask('specs', ['runAllTests']);
    grunt.registerTask('runFunctionalTests', ['buildAssets', 'shell:functionalTest']);
    grunt.registerTask('updateJsVersion', ['replace']);
};
