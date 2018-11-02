import fs from 'fs';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import { createBundleRenderer } from 'vue-server-renderer';
import configBase from './configs/config.base';

const port = process.env.PORT || configBase.port;
const isDev = process.env.NODE_ENV === 'development';
const app = new express();
// dir&file
const resolve = file => path.resolve(__dirname, file);
const publicDir = resolve('./public');  // 静态文件目录
const distDir = resolve(`.${configBase.buildDir}`);  // webpack打包目录
const template = fs.readFileSync(resolve('./src/index.template.html'), 'utf-8');

/* middleware */
// static
const staticConfig = {
  maxAge: isDev ? 0 : 1000 * 60 * 60 * 24 * 30
};
app.use(configBase.buildDir, express.static(distDir, staticConfig));
app.use('/public', express.static(publicDir, staticConfig));

// cookie、header etc.
app.use(cookieParser());
app.use((req, res, next) => {
  global.navigator = {
    userAgent: req.headers['user-agent']
  };
  global.reqHeaders = req.headers;
  next();
});

// ssr
let renderer;
let readyPromise;

const createRenderer = (bundle, options) => (
  createBundleRenderer(bundle, Object.assign(options, {
    template,
    basedir: distDir,
    runInNewContext: false
  }))
);

const handleError = (req, res, err) => {
  const { code } = err;
  if (code === 404) {
    res.status(404).end('404');
  } else if (code === 301) {
    res.redirect(err.path);
  } else {
    res.status(500).end('500');
    console.error(`render error: ${req.url}`);
    console.error(err.stack);
  }
};

const render = (req, res, renderer) => {
  const s = Date.now();

  res.setHeader('Content-Type', 'text/html');

  const context = {
    title: '',
    req
  };

  renderer.renderToString(context)
    .then((html) => {
      res.end(html);
    })
    .catch((err) => {
      handleError(req, res, err);
    });

  if (isDev) {
    console.log(`request: ${Date.now() - s}ms`);
  }
};

if (isDev) {
  readyPromise = require('./setup-dev-server')(app, (bundle, options) => {
    renderer = createRenderer(bundle, options);
  });
} else {
  const bundle = require(`.${configBase.buildDir}/vue-ssr-server-bundle.json`);
  const clientManifest = require(`.${configBase.buildDir}/vue-ssr-client-manifest.json`);
  renderer = createRenderer(bundle, {
    clientManifest
  });
}

app.get('*', (req, res) => {
  if (isDev) {
    readyPromise.then(() => render(req, res, renderer));
  } else {
    render(req, res, renderer);
  }
});

app.listen(port, () => {
  console.log(`> Ready on http://localhost:${port}`)
});
