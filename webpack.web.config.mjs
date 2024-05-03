/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const entry = './src/openepcis-event-sentry.polyfill.js';

export default {
  entry,
  mode: 'production',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'openepcis-event-sentry.browser.js',
    libraryTarget: 'commonjs2',
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
      },
    ],
  },
};
