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