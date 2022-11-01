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
2、HTTPS混合内容的问题