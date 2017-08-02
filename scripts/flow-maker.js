// @flow
/**
 * Running of this script assumes that node is already installed and in the PATH
 * 
 * This little script will do the following:
 * - Create a directory layout
 *   - src
 *     - libs
 *   - tests
 *   - docs
 *     - manual
 *   - routes*
 *   - components*
 * - Install the following npm modules as dev deps
 *   - babel-core, babel-cli, babel-loader, babel-plugin-transformer-react-jsx, babel-preset-env
 *   - webpack*, webpack-dev-server*
 *   - flow-bin
 * - Install the following npm modules
 *   - rxjs
 *   - cyclejs
 *   - koa
 *   - tape
 *   - immutablejs
 *   - react*, react-dom*, react-redux*, react-router*
 *   - redux
 * - Add babel script to package.json
 * 
 *  Items marked with an asterix will only be installed if the --spa is used
 */

const cp = require("child_process")
