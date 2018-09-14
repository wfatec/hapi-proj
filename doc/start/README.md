# hapi实践
由于对这个框架一无所知，目前国内的资料也较为匮乏，这里就直接对官网提供的例子进行实践。[原文地址](https://hapijs.com/tutorials)

## hapi初探

### 安装

新建文件夹hapi-proj

- Run: ```cd hapi-proj``` 进入项目文件夹
- Run: ```npm init ``` 初始化项目
- Run: ```yarn add hapi``` 安装hapi,并将其添加到package.json的dependency下

现在我们已经万事俱备，可以用hapi创建自己的server了。

### 创建一个服务

最基础的一个server看起来像这样：
```js
'use strict';

const Hapi = require('hapi');

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

const init = async () => {

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
```

首先加载hapi。然后创建一个新的hapi服务器，传入的配置对象包含了主机和端口。然后我们启动该服务并输出运行信息。

当创建一个服务时，我们也可以提供一个主机名称，IP地址或者Unix socket文件，或者windows命名管道来绑定服务。

## 添加路由
尽管我们有了一个服务，但是还需要添加路由才能完成具体的功能。让我们看一下下面的代码：
```js
'use strict';

const Hapi = require('hapi');

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {

        return 'Hello, world!';
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: (request, h) => {

        return 'Hello, ' + encodeURIComponent(request.params.name) + '!';
    }
});

const init = async () => {

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
```

Run ```npm start```重新启动服务,当我们访问 [http://localhost:3000](http://localhost:3000) 时，网页显示为```Hello,World```,访问 [http://localhost:3000/stimpy](http://localhost:3000/stimpy)时，显示```Hello, stimpy!```。

我们在代码中注意到使用了encodeURIComponent对参数进行了处理，主要是为了防止内容注入攻击，对输入参数进行编码是一个好习惯！

`method`参数可以是任意有效的HTTP方法，我们也可以输入数组或者星号(*)来允许任意方法访问。它还包含了很多的可选参数，通配符等。详细内容请参考[the routing tutorial](https://hapijs.com/tutorials/routing)

## 创建静态页面
在此前的文章中我们成功创建了一个返回helloworld的服务器，接下来我们将尝试通过名为inert的插件实现一个静态资源服务器。
**安装inert**：
```js
npm install --save inert
```
更新init方法
```js
const init = async () => {

    await server.register(require('inert'));

    server.route({
        method: 'GET',
        path: '/hello',
        handler: (request, h) => {

            return h.file('./public/hello.html');
        }
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};
```
其中`server.register()`方法将插件inert注册到hapi应用中。

`server.route()`方法注册一个`/hello`路由，它告诉服务在接收到GET类型的`/hello`请求时，返回一个`hello.html`文件。我们将路由注册放在注册`inert`插件的注册之后，这样可以确保在执行时，路由所依赖的插件已经存在与应用中。

现在运行`npm start`后在浏览器访问`http://localhost:3000/hello `,会发现出现错误，原因时对应路径下没有`hello.html`文件。现在我们新建`public`文件见，然后在该文件夹下新建`hello.html`,内容为：
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Hapi.js is awesome!</title>
  </head>
  <body>
    <h1>Hello World.</h1>
  </body>
</html>
```

现在重新执行后，刷新网页就能看到正确的内容了。

[inert](https://github.com/hapijs/inert)插件能够提供静态资源服务，当对应的请求出现时，可以返回硬盘上任意的文件资源。

## 使用插件

在实际web项目开发中，访问服务时希望能够打印相关日志，我们接下来就介绍一个好用的log插件[hapi-pino](https://github.com/pinojs/hapi-pino).

安装：
```
npm install hapi-pino
```
修改`server.js`:
```js
'use strict';

const Hapi = require('hapi');

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {

        return 'Hello, world!';
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: (request, h) => {

        // request.log(['a', 'name'], "Request name");
        // or
        request.logger.info('In handler %s', request.path);

        return `Hello, ${encodeURIComponent(request.params.name)}!`;
    }
});

const init = async () => {

    await server.register({
        plugin: require('hapi-pino'),
        options: {
            prettyPrint: true,
            logEvents: ['response']
        }
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
```
在访问服务后，在控制台将看到如下信息：
```
[1536933151601] INFO (2716 on localhost): request completed
    req: {
      "id": "1536933151578:localhost:2716:jm22b8yx:10000",
      "method": "get",
      "url": "/",
      "headers": {
        "host": "localhost:3000",
        "connection": "keep-alive",
        "cache-control": "max-age=0",
        "upgrade-insecure-requests": "1",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.36",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8"
      }
    }
    res: {
      "statusCode": 200,
      "header": "HTTP/1.1 200 OK\r\ncontent-type: text/html; charset=utf-8\r\ncache-control: no-cache\r\ncontent-length: 13\r\naccept-ranges: bytes\r\nDate: Fri, 14 Sep 2018 13:52:31 GMT\r\nConnection: keep-alive\r\n\r\n"
    }
    responseTime: 20
```

logger的具体行为可以在option中进行配置。

## 写在最后

本问只介绍了hapi中很小的一部分功能，更多详细功能可以通过[API文档](https://hapijs.com/api)来查看