"use strict";

const path = require('path');
const webpack = require('webpack');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');

const PROJECT_DIR = path.join(__dirname);

const PAGES = {
  home: path.join( PROJECT_DIR, 'frontend/scripts/pages/home.js'),
};
module.exports = {
     entry: PAGES,
     output: {
         path: path.join( PROJECT_DIR, './static/scripts/pages'),
         filename: '[name].js',
     },
     module: {
         loaders: [{
             test: /\.js$/,
             exclude: /node_modules/,
             loader: 'babel-loader'
          },
          {
              test: `${PROJECT_DIR}/node_modules/scotchPanels/src/scotchPanels.js`,
              loader: "imports?$=>jquery"
          },
          {
            test: /\.modernizrrc$/,
            loader: "modernizr"
          }
       ],
      //  resolve:{
      //    alias:{
      //      modernizr$: `${PROJECT_DIR}/.modernizrrc`
      //    }
      //  }
     },
     'plugins': [
          new webpack.optimize.CommonsChunkPlugin({
              name: 'core',
              filename: 'core.js'
          }),
          new ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery',
            // "Tether": 'tether',
            // "window.Tether": "tether",
        }),
        new webpack.optimize.UglifyJsPlugin(),
      ],
      // resolve:{
      //   alias: {
      //     scotchPanels:path.resolve(
      //       __dirname, 'node_modules/scotchPanels/src/scotchPanels.js'
      //     ),
      //     slick:path.resolve(
      //       __dirname, 'node_modules/slick-carousel'
      //     )
      //   }
      // }
      resolve:{
        alias:{
          modernizr$: `${PROJECT_DIR}/.modernizrrc`
        }
      }
 };
