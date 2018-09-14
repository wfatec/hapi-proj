# 权限认证（Authentication）

hapi中的权限是基于`schemes`和`strategies`的概念实现的。

可以将`scheme`看作是一个通用的权限类型，例如“basic”或者“digest”。另外可以定义一种策略作为一个预先配置和命名的scheme实例。
下面来看一个使用[hapi-auth-basic](https://github.com/hapijs/hapi-auth-basic)的栗子：

```js
'use strict';

const Bcrypt = require('bcrypt');
const Hapi = require('hapi');

const users = {
    john: {
        username: 'john',
        password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm',   // 'secret'
        name: 'John Doe',
        id: '2133d32a'
    }
};

const validate = async (request, username, password) => {

    const user = users[username];
    if (!user) {
        return { credentials: null, isValid: false };
    }

    const isValid = await Bcrypt.compare(password, user.password);
    const credentials = { id: user.id, name: user.name };

    return { isValid, credentials };
};

const start = async () => {

    const server = Hapi.server({ port: 4000 });

    await server.register(require('hapi-auth-basic'));

    server.auth.strategy('simple', 'basic', { validate });

    server.route({
        method: 'GET',
        path: '/',
        options: {
            auth: 'simple'
        },
        handler: function (request, h) {

            return 'welcome';
        }
    });

    await server.start();

    console.log('server running at: ' + server.info.uri);
};

start();
```
首先我们定义了我们的users数据库，着这个例子中只是一个简单的对象。然后我们定义一个校验函数，它是hapi-auth-basic的一个特殊功能，允许我们验证user是否提供了有效的凭证。

接下来我们注册一个插件，用于创建一个名为basic的scheme。该过程在插件内部通过server.auth.scheme()实现。

插件注册完成之后我们使用`server.auth.strategy()`来创建一个名为`simple`的策略(strategy)，并且关联名为`basic`的的scheme。我们也传递了一个可选对象来传入scheme并且允许我们配置其行为。

最后我们要做的就是告诉路由使用名为`simple`的策略来进行权限验证。

## Schemes

```scheme```是指包含签名函数(signature)```function(server,option)```的一种方法。参数`server`是该scheme所在server的引用，参数`option`是当使用该scheme注册一个策略时传入的配置对象。

该方法必须返回一个对象，该对象至少包含校验的key值。其他的可选方法为`payload`和`response`。