module.exports = function(config) {
    config.set({
        frameworks: ['mocha'],
        files: [
            'lib/*.js',
            'node_modules/expect.js/index.js',
            'test/*.js'
        ],
        preprocessors: {
            'lib/*.js': ['babel'],
            'test/*.js': ['babel']
        },
        reporters: ['progress'],

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        browsers: ['Chrome'],

        autoWatch: true,
        singleRun: false,

        babelPreprocessor: {
            options: {
                sourceMap: 'inline',
                modules: 'umd'
            }
        },

        client: {
            mocha: {
                ui: 'bdd'
            }
        }
    });
};
