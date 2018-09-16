# 路由

与其他框架一样，hapi中定义一个路由需要三个基本元素：路径（path），方法（method）和一个处理方法（handler）。这些都将以对象的形式传入你的服务器，并且可以简单定义成如下形式：
```js
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, h) {

        return 'Hello!';
    }
});
```

## Method
以上的路由对请求路径为“/”的GET请求作出响应，返回值为字符串“Helllo！”。method选项可以是任意有效的HTTP方法或数组。当你希望对用户发送PUT或者POST请求作出相同响应时，你可以使用下面的方法：
```js
server.route({
    method: ['PUT', 'POST'],
    path: '/',
    handler: function (request, h) {

        return 'I did something!';
    }
});
```

## Path

path选项必须是一个字符串，尽管如此它还可以包含命名的参数。想要在path中命名一个参数可以简单的通过`{}`将其包裹。例如：
```js
server.route({
    method: 'GET',
    path: '/hello/{user}',
    handler: function (request, h) {

        return `Hello ${encodeURIComponent(request.params.user)}!`;
    }
});
```
可以看到path字符串中的`{user}`，意味着我们可以在命名参数中中找到响应的片段。这些命名参数被存储在`request.params`对象中。由于我们将参数命名为`user`，我们可以通过`request.params.user`获取它的值。

## Optional parameters

上面的栗子中`user`参数是必须的：`/hello/bob`或者`/hello/susen`可以正常访问，但是`/hello`却会出错。为了可以设置一个可选参数，可以在参数名称的末尾加入问号作为标记。举个例子：
```js
server.route({
    method: 'GET',
    path: '/hello/{user?}',
    handler: function (request, h) {

        const user = request.params.user ?
            encodeURIComponent(request.params.user) :
            'stranger';

        return `Hello ${user}!`;
    }
});
```
现在我们访问`/hello`也能得到返回结果`Hello stranger!`。需要额外额外注意的是，只有做后一个命名参数可以作为可选项，这意味着`/{one?}/{two}/`是一个无效路径。此外将路径片段的一部分作为命名参数也是可以的,例如`/{filename}.jpg`是有效的。最后你也可以将有点符号隔开的两部分分别作为命名参数，例如`{filename}.{ext}`有效，而`/{filename}{ext}`无效。

## Multi-segment parameters

除了可选参数，我们还可以允许参数匹配多个片段。为了实现上述效果我们可以使用一个星号和一个数字。例如：
```js
server.route({
    method: 'GET',
    path: '/hello/{user*2}',
    handler: function (request, h) {

        const userParts = request.params.user.split('/');
        return `Hello ${encodeURIComponent(userParts[0])} ${encodeURIComponent(userParts[1])}!`;
    }
});
```

这时`/hello/john/doe`将返回`Hello john doe!`。需要注意的是参数的值实际上是字符串`john/doe`。星号后面的数字是表示多少片段需要被存入参数中。这个数字可以忽略，表示任意数量，且只能出现在最后。

当为特定的某个请求选择处理函数时，hapi以匹配程度最高到最低的顺序来查找。这意味着如果有两个路由，一个是`/filename.jpg`，另一个是`/filename.{ext}`。如果请求为`/filename.jpg`，则将匹配前者。同时，如果还有一个路由为`/{files*}`,则只有当其他路由都匹配失败时才会匹配。

## Handler method

`handler`选项是一个函数，接收两个参数：`request`和`h`。

`request`参数是一个包涵了用户请求详细信息的对象，例如path参数，an associated payload，鉴权信息，头部信息等等。更多信息可参考[API文档](https://hapijs.com/api#request-properties)

第二个参数`h`是一个响应工具（response toolkit），一个包含一些用于响应请求的方法的对象。如此前的栗子中，如果你希望返回一些数值，你可以简单的在handler中返回它。负载（payload）可以是一个字符串，buffer，JSON序列化对象，流（stream）或是promise。

同样的，你可以传递同样的值到`h.response(value)`，并且将其从`handler`中返回。调用的结果是一个响应对象，可以与其它方法形成链式传递，并在发送前对响应进行改变。例如`h.response('created').code(201)`，发送一个值为`created`的负载，并将http状态吗设置为`201`。你也可以设置headers，content type，content length，发送一个重定向响应。详细内容请参考[API文档](https://hapijs.com/api#response-toolkit)。

## Config

除了前文介绍的三个基本元素，你也可以为每个路由指定一个可选参数。这里可以配置校验规则（validation），鉴权（authentication），负载处理（payload processing），以及缓存选项。

下面我们将使用一组选项用于帮助生成文档。

```js
server.route({
    method: 'GET',
    path: '/hello/{user?}',
    handler: function (request, h) {

        const user = request.params.user ?
            encodeURIComponent(request.params.user) :
            'stranger';

        return `Hello ${user}!`;
    },
    options: {
        description: 'Say hello!',
        notes: 'The user parameter defaults to \'stranger\' if unspecified',
        tags: ['api', 'greeting']
    }
});
```
一般来说这些选项不会对代码产生影响，但是当使用类似[lout](https://github.com/hapijs/lout)的插件来生成API文档时会非常有用。