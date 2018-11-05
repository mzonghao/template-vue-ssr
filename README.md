# template-vue-ssr

## 目录
- [分支概况](#分支概况)
    * [Express版](#Express版)
    * [Koa版](#Koa版)
- [使用文档](#使用文档)
    * [ssr](#ssr)
    * [ajax](#ajax)
    * [router](#router)
    * [localStorage](#localStorage)
    * [cookie](#cookie)
    * [message](#message)
    * [filter](#filter)
    * [contants](#contants)
    * [vue-plugins](#vue-plugins)
    * [title](#title)
- [项目结构](#项目结构)
- [其他](#其他)

******

## 分支概况

### Express版
* [点击打开 base 分支](https://github.com/mzonghao/template-vue-ssr/tree/base)
### Koa版
* [点击打开 base-with-koa 分支](https://github.com/mzonghao/template-vue-ssr/tree/base-with-koa)

## 使用文档

### ssr
* 若使用 ssr, 请这样
    ```
    <template>
    ...
    </template>

    <script>
        import { DI } from 'core';

        export default {
            name: 'index',

            asyncData() {
                return DI.get('requestCommon').getUsers('100') 
                    .then(data => (data))
                    .catch((e) => {
                    DI.get('ssr').handleError(e);
                    });
            },

            computed: {
                prefetchData() {
                    return DI.get('ssr').getContent('index'); // index 为组件 name
                }
            }
        }
    </script>
    ```
* name 是获取 ssr 结果的 key   
* 具体请求地址封装在 ./src/core/service/http-common.js 的 RequestCommon 中

### ajax
* configs 中可以配置 baseURL
* 其他更多封装在 ./src/core/service/中

### router
* 添加路由在 ./src/core/router/index.js 中
* 新页面请在 ./src/pages/ 中添加
* 路由跳转 DI.get('router').push(跳转地址)

### localStorage
* get - DI.get('clientStorage').get('XXX')
* set - DI.get('clientStorage').set('XXX')
* 其他更多封装在 ./src/core/localStorage/ 中

### cookie
* get - DI.get('cookie').get('XXX')
* set - DI.get('cookie').set('XXX')
* 其他更多封装在 ./src/core/cookie/ 中

### message
* 浏览器弹出历史信息，默认2秒
* 使用
    ```
    import { Message } from 'components';

    ...
    Message('XXX')
    ...
    ```
* 用 vue-plugin 的形式拓展，封装在 ./src/core/plugins/toast
* style 与 mint-ui 的 toast 一致

### filter
* 封装在 ./src/core/filter/ 中，可以直接使用
    ```
    <div>{{ data | filterFunction }}</div> 
    ```
* 也可以 DI.get('filter').XXX 调用

### contants
* 封装在 ./src/core/contants/ 中
* 可以直接根据常量名调用 DI.get('XXX')
* 常量名字最好大写区分

### vue-plugins
* 封装在 ./src/core/plugins/ 中

### title
* 需要在 mounted 中 DI.get('utils').setTitle('首页');
 
## 项目结构
```
.
├── configs //优先度高 的会覆盖 优先度低 的
    ├── config.base.js          常用基本配置 优先度低
    ├── config.development.js   开发环境配置 优先度高
    ├── config.test.js          测试环境配置 优先度高
    ├── config.production.js    生产环境配置 优先度高
    ├── config.development.local.js 开发环境本地配置 优先度最高 属于 gitignore
    ├── index.js 会把 config.base, config.ENV, config.ENV.local 合并输出
    ├── webpack.base.config.js webpack 浏览器和服务端打包共同配置
    ├── webpack.client.config.babel.js 浏览器端打包配置
    ├── webpack.server.config.babel.js 服务端打包配置
├── public 静态资源专用目录
├── src
    ├── components          公用组件库
        ├── root            全局配置组件
        ├── progress-bar    页面加载进度组件
        ├── message         弹出信息提示组件
        ...
    ├── core                app核心 都可以通过 DI 调用
        ├── config          获取 config 配置的方法
        ├── constants       常量
        ├── cookie          cookie 方法
        ├── filter          vue 的 filter
        ├── localStorage    localStorage
        ├── plugins         vue 的拓展 plugins
        ├── router          路由
        ├── services        封装 ajax 请求 基于axios
        ├── ssr             封装获取 ssr 数据的方法 实际从 store 中读取
        ├── store           vuex
        ├── utils           工具函数
        ├── di              DI 调用 core 各部分的实例
    ├── pages
        ├── layout          layout
        ...
    ├── client-entry.js     浏览器 bundle 打包入口
    ├── server-entry.js     服务器 bundle 打包入口
    ├── setup-app.js        web-app 启动初始化
    ├── index.template.html vue ssr 挂载模版
├── .babelrc                babel 配置
├── .eslintrc               eslint 配置
├── .gitignore              git 忽略文件
├── index.js                服务端启动服务文件
├── setup-dev-server.js     开发用热更新
├── package.json            项目信息、依赖
├── README.md               文档
```

## 其他
