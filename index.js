import fs from 'fs';
import path from 'path';
import Koa from 'koa';
import KoaRouter from 'koa-router';
import koaMount from 'koa-mount';
import koaStatic from 'koa-static';
import koaCookie from 'koa-cookie';
import { createBundleRenderer } from 'vue-server-renderer';
import configBase from './configs/config.base';

const port = process.env.PORT || configBase.port;
const isDev = process.env.NODE_ENV === 'development';
const app = new Koa();
const router = new KoaRouter();
// dir&file
const resolve = file => path.resolve(__dirname, file);
const publicDir = resolve('./public'); // 静态文件目录
const distDir = resolve(`.${configBase.buildDir}`); // webpack打包目录
const template = fs.readFileSync(resolve('./src/index.template.html'), 'utf-8');

/* middleware */
// static
const staticConfig = {
  maxAge: isDev ? 0 : 1000 * 60 * 60 * 24 * 30
};

app.use(koaMount(configBase.buildDir, koaStatic(distDir, staticConfig)));
app.use(koaMount('/public', koaStatic(publicDir, staticConfig)));

// cookie、header etc.

app.use(koaCookie());
app.use(async (ctx, next) => {
  const { req } = ctx;
  global.navigator = {
    userAgent: req.headers['user-agent']
  };
  global.reqHeaders = req.headers;
  await next();
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

const handleError = (ctx, err) => {
  const { code } = err;
  if (code === 404) {
    ctx.status = 404;
  } else if (code === 301) {
    res.redirect(err.path);
  } else {
    ctx.status = 500;
    console.error(`render error: ${req.url}`);
    console.error(err.stack);
  }
};

const render = async (ctx, renderer) => {
  const s = Date.now();
  const { req, res } = ctx;
  ctx.set('Content-Type', 'text/html');

  const context = {
    title: '',
    req
  };

  try {
    ctx.body = await renderer.renderToString(context);
  } catch (err) {
    handleError(req, res, err);
  }

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

router.get('*', (ctx) => {
  if (isDev) {
    return readyPromise.then(() => render(ctx, renderer));
  }
  return render(ctx, renderer);
});

app.use(router.routes());

app.listen(port, () => {
  console.log(`> Ready on http://localhost:${port}`);
});
