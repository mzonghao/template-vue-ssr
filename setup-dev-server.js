import path from 'path';
import webpack from 'webpack';
import MFS from 'memory-fs';
import configBase from './configs/config.base';
import clientConfig from './configs/webpack.client.config.babel';
import serverConfig from './configs/webpack.server.config.babel';

const readFile = (fs, file) => {
  try {
    return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8')
  } catch (e) {}
};

const setupDevServer =  (app, cb) => {
  let bundle, appManifest;
  let resolve;
  const readyPromise = new Promise(r => { resolve = r });
  const ready = (...args) => {
    resolve();
    cb(...args)
  };
  const hmr = `webpack-hot-middleware/client?path=http://localhost:${configBase.port}/__webpack_hmr`;
  clientConfig.entry.app = [hmr, clientConfig.entry.app];
  clientConfig.output.filename = '[name].js'; // dev remove hash
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );
  const appCompiler = webpack(clientConfig);
  const devMiddleware = require('webpack-dev-middleware')(appCompiler, {
    publicPath: `${clientConfig.output.publicPath}`,
    noInfo: true
  });
  app.use(devMiddleware);
  appCompiler.plugin('done', stats => {
    stats = stats.toJson();
    stats.errors.forEach(err => console.error(err));
    stats.warnings.forEach(err => console.warn(err));
    if (stats.errors.length) return;

    appManifest = JSON.parse(readFile(
      devMiddleware.fileSystem,
      'vue-ssr-client-manifest.json'
    ));
    if (bundle) {
      ready(bundle, {
        clientManifest: appManifest
      })
    }
  });
  app.use(require('webpack-hot-middleware')(appCompiler));
  const serverCompiler = webpack(serverConfig);
  const mfs = new MFS();
  serverCompiler.outputFileSystem = mfs;
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err;
    stats = stats.toJson();
    if (stats.errors.length) return;
    bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'));
    if (appManifest) {
      ready(bundle, {
        clientManifest: appManifest
      })
    }
  });
  return readyPromise
};

module.exports = setupDevServer;
