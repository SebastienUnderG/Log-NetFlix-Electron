const path = require('path');
/*
module.exports = {
    mode: 'development', // development ou production
    devtool: 'cheap-module-source-map',
    entry: './src/index.ts',
    module: {
        rules: [
            {
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    target: 'electron-app',
    output: {
        filename: 'index_packed.js',
        path: path.resolve(__dirname, 'dist')
    }
};

module.exports = {
    mode: 'production', // development ou production
    devtool: 'cheap-module-source-map',
    entry: './src/main.ts',
    module: {
        rules: [
            {
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    target: 'electron-main',
    //electron-renderer 'electron-main'
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    }
};
*/

module.exports = {
    mode: 'development', // development ou production
    devtool: 'cheap-module-source-map',
    entry: {
        main : './src/main.ts',
        index : './src/index.ts',
        preload : './src/preload.ts'

    },
    module: {
        rules: [
            {
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    target: 'electron-main',
    //electron-renderer 'electron-main'
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
};