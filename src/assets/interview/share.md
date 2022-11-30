# 消息队列和事件循环
## 使用单线程处理安排好的人物
![diff](https://static001.geekbang.org/resource/image/72/bc/72726678ac6604116c1d5dad160780bc.png)
## 在线程运行过程中处理新任务
要想在线程运行过程中，接受并执行新的任务，就需要采用事件循环机制,循环系统在执行一个任务时，都会给这个任务维护一个系统调用栈
````
//GetInput
//等待用户从键盘输入一个数字，并返回该输入的数字
int GetInput(){
    int input_number = 0;
    cout<<"请输入一个数:";
    cin>>input_number;
    return input_number;
}

//主线程(Main Thread)
void MainThread(){
     for(;;){
          int first_num = GetInput()；
          int second_num = GetInput()；
          result_num = first_num + second_num;
          print("最终计算的值为:%d",result_num)；
      }
}
````
![diff](https://static001.geekbang.org/resource/image/9e/e3/9e0f595324fbd5b7cd1c1ae1140f7de3.png)
## 处理其他线程发送过来的任务
上面的版本的任务都是线程内部的，不能处理其他线程的任务，这时候就需要用到消息队列进行处理了。
![diff](https://static001.geekbang.org/resource/image/2a/ab/2ac6bc0361cb4690c5cc83d8abad22ab.png)
## 消息队列中的任务类型
内部消息类型：输入事件、微任务、文件读写、websocket、定时器等

## 单线程的缺点和解决
1、如何处理高优先级的任务  
对于一个高优先级的任务（如dom节点的增删），如果采用同步的方式，即每次变化都调用相对于的js接口，会导致任务的执行效率下降。采用异步，放到消息队列里，又会影响到监控的时效性。  
解决：引入微任务，通常来说，消息队列中的任务为宏任务，每个宏任务都包含了一个微任务队列，在宏任务执行的过程中，如果发生dom的变化，就会将变化添加到微任务列表中，这样不会影响到宏任务的继续执行，等宏任务中的主要功能完成后，渲染引擎会执行当前宏任务中的微任务队列，从而也解决了时效性问题  
通常来说宿主发起的任务是宏任务（点击事件等），js引擎发起的任务是微任务（primise）
2、单个任务执行时长过久的问题  
![diff](https://static001.geekbang.org/resource/image/8d/cc/8de4b43fca99b180fdffe6a5af07b5cc.png)  
解决： 回调功能、让要执行的js任务滞后执行

# setTimeOut是如何实现的
在chrome中除了正常使用的消息队列之外，还有另外一个消息队列，这个队列维护了需要延迟执行的任务列表，包括了定时器和chromium内部一些需要延迟执行的任务。当js创建定时器时，渲染进程会将定时器的回调任务添加到延迟队列中。（包含showName，当前发起时间，延迟执行时间）  
触发：处理完消息队列中的一个任务之后，开始执行ProcessTimerTask函数，找出到期的任务，然后依次执行，等到期的任务执行完成后，再继续下一个循环。
````
void ProcessTimerTask(){
  //从delayed_incoming_queue中取出已经到期的定时器任务
  //依次执行这些任务
}

TaskQueue task_queue；
void ProcessTask();
bool keep_running = true;
void MainTherad(){
  for(;;){
    //执行消息队列中的任务
    Task task = task_queue.takeTask();
    ProcessTask(task);
    
    //执行延迟队列中的任务
    ProcessDelayTask()

    if(!keep_running) //如果设置了退出标志，那么直接退出线程循环
        break; 
  }
}
````
## setTimeOut的一些注意事项
1、当前任务执行时间过久，会影响到定时器任务的执行
````
function bar() {
    console.log('bar')
}
function foo() {
    setTimeout(bar, 0);
    for (let i = 0; i < 50000; i++) {
        let i = 5+8+8+8
        console.log(i)
    }
}
foo()
````
2、setTimeout嵌套调用，系统会设置最短时间间隔为4ms  
3、未激活的页面，setTimeOut执行最小间隔是1000ms  
4、延时执行时间有最大值（2147483647ms）  
5、使用setTimeOut设置的回调函数中的this不符合直觉(回调函数是某个对象的方法，方法的this会指向全局环境，而不是定义的对象)
````
var name= 1;
var MyObj = {
  name: 2,
  showName: function(){
    console.log(this.name);
  }
}
setTimeout(MyObj.showName,1000)
````
解决：  
1、放在匿名函数中执行  
2、使用bind绑定在MyObj上

# XMLHttpRequest是怎么实现的

## 同步回调和异步回调
````
let callback = function(){
    console.log('i am do homework')
}
function doWork(cb) {
    console.log('start do work')
    cb()
    console.log('end do work')
}
doWork(callback)
````

````
let callback = function(){
    console.log('i am do homework')
}
function doWork(cb) {
    console.log('start do work')
    setTimeout(cb,1000)   
    console.log('end do work')
}
doWork(callback)
````
每个任务都有自己的调用栈，同步回调就是在当前主函数的上下文中执行回调函数，  
异步回调指回调函数在主函数之外执行，一般有两种方式：1、把异步函数做成一个任务，添加到信息队列尾部；2、把异步函数添加到微任务队列，这样可以在当前任务的末尾处执行

##  XMLHttpRequest运行机制
![diff](https://static001.geekbang.org/resource/image/29/c6/2914a052f4f249a52077692a22ee5cc6.png)

````
function GetWebData(URL){
    /**
     * 1:新建XMLHttpRequest请求对象
     */
    let xhr = new XMLHttpRequest()

    /**
     * 2:注册相关事件回调处理函数 
     */
    xhr.onreadystatechange = function () {
        switch(xhr.readyState){
          case 0: //请求未初始化
            console.log("请求未初始化")
            break;
          case 1://OPENED
            console.log("OPENED")
            break;
          case 2://HEADERS_RECEIVED
            console.log("HEADERS_RECEIVED")
            break;
          case 3://LOADING  
            console.log("LOADING")
            break;
          case 4://DONE
            if(this.status == 200||this.status == 304){
                console.log(this.responseText);
                }
            console.log("DONE")
            break;
        }
    }

    xhr.ontimeout = function(e) { console.log('ontimeout') }
    xhr.onerror = function(e) { console.log('onerror') }

    /**
     * 3:打开请求
     */
    xhr.open('Get', URL, true);//创建一个Get请求,采用异步


    /**
     * 4:配置参数
     */
    xhr.timeout = 3000 //设置xhr请求的超时时间
    xhr.responseType = "text" //设置响应返回的数据格式
    xhr.setRequestHeader("X_TEST","time.geekbang")

    /**
     * 5:发送请求
     */
    xhr.send();
}
````
## XMLHttpRequest使用过程中的问题
1、跨域问题  
2、HTTPS混合内容的问题,XMLHttpRequest会阻止此类请求

# 宏任务和微任务
宏任务包括：  
1、渲染事件（解析dom，计算布局，绘制）  
2、用户交互事件（鼠标点击，滚动）  
3、js脚本执行事件  
4、网络请求、文件读写完成事件  
宏任务可以满足大部分的日常需求、但是因为各种IO的完成事件，执行js脚本的事件，用户交互的事件会随时添加到队列中，
````
 function timerCallback2(){
          console.log(2)
        }
        function timerCallback(){
            console.log(1)
            setTimeout(timerCallback2,0)
        }
        setTimeout(timerCallback,0)
````

微任务：就是一个需要异步执行的函数，执行时机在主函数执行结束之后，当前宏任务结束之前。  

产生微任务的两种方式：  
1、第一种是通过MutationObserver监控某个DOM节点，然后通过js修改节点，当dom节点发生变化时，产生DOM变化记录的微任务。  
2、使用promise，调用reject或者resolve是，会产生微任务  

执行：每个宏任务都有一个微任务的队列，在执行微任务的过程中，产生新的微任务，会将该任务添加到队列中，然后一直循环执行，直到队列为空

微任务和宏任务：  
1、微任务和宏任务是绑定的，每个宏任务都会创建自己的微任务队列  
2、微任务会影响宏任务的时长  
3、在一个宏任务中，微任务的回调总是先于宏任务


# 使用promise
promise解决的问题：解决的是异步编码风格的问题  
## 异步编程的问题：代码逻辑不连续
首先页面中的任务都是执行在主线程之上的，在执行一项耗时的任务时，比如下载网络文件、获取摄像头等设备信息任务，这些都会放到页面主线程之外的进程或者线程中执行，避免耗时任务霸占主线程
![diff](https://static001.geekbang.org/resource/image/01/85/01e40e30db7e8a91eb70ce02fd8a6985.png)

例子：有一个下载的需求，使用XMLHttpRequest实现
````
//执行状态
function onResolve(response){console.log(response) }
function onReject(error){console.log(error) }

let xhr = new XMLHttpRequest()
xhr.ontimeout = function(e) { onReject(e)}
xhr.onerror = function(e) { onReject(e) }
xhr.onreadystatechange = function () { onResolve(xhr.response) }

//设置请求类型，请求URL，是否同步信息
let URL = 'https://time.geekbang.com'
xhr.open('Get', URL, true);

//设置参数
xhr.timeout = 3000 //设置xhr请求的超时时间
xhr.responseType = "text" //设置响应返回的数据格式
xhr.setRequestHeader("X_TEST","time.geekbang")

//发出请求
xhr.send();
````
## 封装异步代码，让处理流程边得线性
![diff](https://static001.geekbang.org/resource/image/83/5c/83dd5231c2e36c636c61af6a6dc80a5c.png)
可以将XMLHttpRequest请求过程的代码封装起来，重点关注输入数据和输出结果
构造request结构
````
function makeRequest(request_url) {
    let request = {
        method: 'Get',
        url: request_url,
        headers: '',
        body: '',
        credentials: false,
        sync: true,
        responseType: 'text',
        referrer: ''
    }
    return request
}
//[in] request，请求信息，请求头，延时值，返回类型等
//[out] resolve, 执行成功，回调该函数
//[out] reject  执行失败，回调该函数
function XFetch(request, resolve, reject) {
    let xhr = new XMLHttpRequest()
    xhr.ontimeout = function (e) { reject(e) }
    xhr.onerror = function (e) { reject(e) }
    xhr.onreadystatechange = function () {
        if (xhr.status = 200)
            resolve(xhr.response)
    }
    xhr.open(request.method, URL, request.sync);
    xhr.timeout = request.timeout;
    xhr.responseType = request.responseType;
    //补充其他请求信息
    //...
    xhr.send();
}
XFetch(makeRequest('https://time.geekbang.org'),
    function resolve(data) {
        console.log(data)
    }, function reject(e) {
        console.log(e)
    })
````
上述方法在一些负责的情况下，会出现回调地狱的情况，主要归根于嵌套调用和任务的不确定性
````
XFetch(makeRequest('https://time.geekbang.org/?category'),
      function resolve(response) {
          console.log(response)
          XFetch(makeRequest('https://time.geekbang.org/column'),
              function resolve(response) {
                  console.log(response)
                  XFetch(makeRequest('https://time.geekbang.org')
                      function resolve(response) {
                          console.log(response)
                      }, function reject(e) {
                          console.log(e)
                      })
              }, function reject(e) {
                  console.log(e)
              })
      }, function reject(e) {
          console.log(e)
      })
````

### 使用promise来解决上述问题，消灭嵌套调用和多次错误处理
````
function XFetch(request) {
  function executor(resolve, reject) {
      let xhr = new XMLHttpRequest()
      xhr.open('GET', request.url, true)
      xhr.ontimeout = function (e) { reject(e) }
      xhr.onerror = function (e) { reject(e) }
      xhr.onreadystatechange = function () {
          if (this.readyState === 4) {
              if (this.status === 200) {
                  resolve(this.responseText, this)
              } else {
                  let error = {
                      code: this.status,
                      response: this.response
                  }
                  reject(error, this)
              }
          }
      }
      xhr.send()
  }
  return new Promise(executor)
}
// 请求流程
var x1 = XFetch(makeRequest('https://time.geekbang.org/?category'))
var x2 = x1.then(value => {
    console.log(value)
    return XFetch(makeRequest('https://www.geekbang.org/column'))
})
var x3 = x2.then(value => {
    console.log(value)
    return XFetch(makeRequest('https://time.geekbang.org'))
})
x3.catch(error => {
    console.log(error)
})

````
Promise主要通过下面两步解决嵌套回调问题  
1、Promise实现了回调函数的延时绑定，主要体现在，先创建Promise对象x1，通过Promise的构造函数执行业务逻辑，再使用x1.then来设置回调函数
````
//创建Promise对象x1，并在executor函数中执行业务逻辑
function executor(resolve, reject){
    resolve(100)
}
let x1 = new Promise(executor)


//x1延迟绑定回调函数onResolve
function onResolve(value){
    console.log(value)
}
x1.then(onResolve)
````
2、将回调函数onResolve的返回值穿透到最外层，因为我们会根据onResolve函数的传入值来决定创建什么类型的Promise任务，创建好的Promise对象需要返回到最外层，从而摆脱嵌套循环。
![diff](https://static001.geekbang.org/resource/image/ef/7f/efcc4fcbebe75b4f6e92c89b968b4a7f.png)

## Promise的错误处理
Promise对象的错误具有冒泡性质，会一直像后面传递，直到被onReject函数处理挥着catch语句捕获

## Promise与微任务
````
function Bromise(executor) {
    var onResolve_ = null
    var onReject_ = null
     //模拟实现resolve和then，暂不支持rejcet
    this.then = function (onResolve, onReject) {
        onResolve_ = onResolve
    };
    function resolve(value) {
          //setTimeout(()=>{
            onResolve_(value)
           // },0)
    }
    executor(resolve, null);
}

function executor(resolve, reject) {
    resolve(100)
}
//将Promise改成我们自己的Bromsie
let demo = new Bromise(executor)

function onResolve(value){
    console.log(value)
}
demo.then(onResolve)
````
此处不使用延时器，会报错onResolve_ is not function, 此时this.then还没执行。所以在resolve中添加延时器，延时执行。promise把这个延时器改造成了微任务，即可以延时调用，又提升了执行效率

# async、await：使用同步的方式去写异步代码
````
fetch('https://www.geekbang.org')
      .then((response) => {
          console.log(response)
          return fetch('https://www.geekbang.org/test')
      }).then((response) => {
          console.log(response)
      }).catch((error) => {
          console.log(error)
      })
````
这段promise代码可以看出，流程线性化了，但是包含了大量的then函数，不易阅读。ES7引入了async/await，提供了在不阻塞主线程的情况下使用同步代码实现异步访问资源的能力，并且使得代码逻辑更加清晰。
````
async function foo(){
  try{
    let response1 = await fetch('https://www.geekbang.org')
    console.log('response1')
    console.log(response1)
    let response2 = await fetch('https://www.geekbang.org/test')
    console.log('response2')
    console.log(response2)
  }catch(err) {
       console.error(err)
  }
}
foo()
````

## 生成器 vs 协程
生成器函数是一个带星号函数，可以暂停执行和恢复执行.  
1、生成器内部遇到yield关键字，js引擎会返回关键字后面的内容，并暂停函数的执行  
2、外部函数可以通过next方法恢复函数的执行
````
function* genDemo() {
    console.log("开始执行第一段")
    yield 'generator 2'

    console.log("开始执行第二段")
    yield 'generator 2'

    console.log("开始执行第三段")
    yield 'generator 2'

    console.log("执行结束")
    return 'generator 2'
}

console.log('main 0')
let gen = genDemo()
console.log(gen.next().value)
console.log('main 1')
console.log(gen.next().value)
console.log('main 2')
console.log(gen.next().value)
console.log('main 3')
console.log(gen.next().value)
console.log('main 4')
````
协程是一种比线程更加轻量级的存在。你可以把协程看成是跑在线程上的任务，一个线程上可以存在多个协程，但是在线程上同时只能执行一个协程，比如当前执行的是A协程，要启动B协程，那么A协程就需要将主线程的控制权交给B协程，这就体现在A协程暂停执行，B协程恢复执行；同样，也可以从B协程中启动A协程。通常，如果从A协程启动B协程，我们就把A协程称为B协程的父协程。  
正如一个进程可以拥有多个线程一样，一个线程也可以拥有多个协程。最重要的是，协程不是被操作系统内核所管理，而完全是由程序所控制（也就是在用户态执行）。这样带来的好处就是性能得到了很大的提升，不会像线程切换那样消耗资源。

![diff](https://static001.geekbang.org/resource/image/5e/37/5ef98bd693bcd5645e83418b0856e437.png)
协程的四点规则

1、通过调用生成器函数genDemo来创建一个协程gen，创建之后，gen协程并没有立即执行。  
2、要让gen协程执行，需要通过调用gen.next。  
3、当协程正在执行的时候，可以通过yield关键字来暂停gen协程的执行，并返回主要信息给父协程。  
4、如果协程在执行期间，遇到了return关键字，那么JavaScript引擎会结束当前协程，并将return后面的内容返回给父协程。

关于gen协程和父协程的调用栈问题：当在gen协程中调用了yield方法时，js引擎会保存gen协程当前的调用栈信息，恢复父协程的调用栈信息，反之亦然

## 使用生成器和Promise来改造开头的Promise代码
````
//foo函数
function* foo() {
    let response1 = yield fetch('https://www.geekbang.org')
    console.log('response1')
    console.log(response1)
    let response2 = yield fetch('https://www.geekbang.org/test')
    console.log('response2')
    console.log(response2)
}

//执行foo函数的代码
let gen = foo()
function getGenPromise(gen) {
    return gen.next().value
}
getGenPromise(gen).then((response) => {
    console.log('response1')
    console.log(response)
    return getGenPromise(gen)
}).then((response) => {
    console.log('response2')
    console.log(response)
})
````
## async
async根据MDN定义：async是一个通过异步执行并隐式放回Promise结果的函数
````
async function foo() {
    return 2
}
console.log(foo())  // Promise {<resolved>: 2}
````
## await
````
async function foo() {
    console.log(1)
    let a = await 100
    console.log(a)
    console.log(2)
}
console.log(0)
foo()
console.log(3)
````
![diff](https://static001.geekbang.org/resource/image/8d/94/8dcd8cfa77d43d1fb928d8b001229b94.png)



````
async function foo() {
    console.log('foo')
}
async function bar() {
    console.log('bar start')
    await foo()
    console.log('bar end')
}
console.log('script start')
setTimeout(function () {
    console.log('setTimeout')
}, 0)
bar();
new Promise(function (resolve) {
    console.log('promise executor')
    resolve();
}).then(function () {
    console.log('promise then')
})
console.log('script end')
````


答案：script start、bar start、foo、promise executor、script end、bar end、promise then、setTimeout