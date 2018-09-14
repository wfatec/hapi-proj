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