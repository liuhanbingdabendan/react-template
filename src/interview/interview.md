# 部分
## Set、Map、WeatSet、WeakMap区别

## Set

ES6新增的一种数据结构，类似于数组， 成员是唯一并且无序的，其判断两个值是否不同，使用的算法叫做"Same-value-zero equality", 类似于精确相等运算符(===), 主要区别在于这个算法NaN等于自身，精确运算符认为NaN不等于自身
const s = new Set()
[1, 2, 3, 4, 3, 2, 1].forEach(x => s.add(x))

for (let i of s) {
    console.log(i)	// 1 2 3 4
}

// 去重数组的重复对象
let arr = [1, 2, 3, 2, 1, 1]
[... new Set(arr)]	// [1, 2, 3]

| 标头 | 表头 |
| ---- | ---- |
| 内容 | 111  |

## 深度优先遍历、广度优先遍历
### 深度优先遍历

`深度优先遍历的三种方式`
`````
let deepTraversal1 = (node, nodeList = []) => {
  if (node !== null) {
    nodeList.push(node)
    let children = node.children
    for (let i = 0; i < children.length; i++) {
      deepTraversal1(children[i], nodeList)
    }
  }
  return nodeList
}

let deepTraversal2 = (node) => {
  let nodes = []
  if (node !== null) {
    nodes.push(node)
    let children = node.children
    for (let i = 0; i < children.length; i++) {
      nodes = nodes.concat(deepTraversal2(children[i]))
    }
  }
  return nodes
}

// 非递归
let deepTraversal3 = (node) => {
  let stack = []
  let nodes = []
  if (node) {
    // 推入当前处理的node
    stack.push(node)
    while (stack.length) {
      let item = stack.pop()
      let children = item.children
      nodes.push(item)
      // node = [] stack = [parent]
      // node = [parent] stack = [child3,child2,child1]
      // node = [parent, child1] stack = [child3,child2,child1-2,child1-1]
      // node = [parent, child1-1] stack = [child3,child2,child1-2]
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i])
      }
    }
  }
  return nodes
}
`````
`广度优先`
`````
let widthTraversal2 = (node) => {
  let nodes = []
  let stack = []
  if (node) {
    stack.push(node)
    while (stack.length) {
      let item = stack.shift()
      let children = item.children
      nodes.push(item)
        // 队列，先进先出
        // nodes = [] stack = [parent]
        // nodes = [parent] stack = [child1,child2,child3]
        // nodes = [parent, child1] stack = [child2,child3,child1-1,child1-2]
        // nodes = [parent,child1,child2]
      for (let i = 0; i < children.length; i++) {
        stack.push(children[i])
      }
    }
  }
  return nodes
}

`````
## Microtask、Macrotask/Task
Microtask(微任务)，Macrotask(宏任务)
首选执行Microtask，按照队列先进先出的原则，一次性执行完所有的Microtask
然后执行Macrotask/Task队列，一次执行一个，一个执行完之后，检测Microtask是否为空
Microtask为空则执行下一个Macrotask
不为空则执行Microtask

setTimeout 放入宏任务队列
promise1 是 resolved或rejected: 那这个 task 就会放入当前事件循环回合的 microtask queue，.then放入宏任务队列(Macrotask)

async 函数返回一个 Promise 对象，当函数执行的时候，一旦遇到 await 就会先返回，等到触发的异步操作完成，再执行函数体内后面的语句。可以理解为，是让出了线程，跳出了 async 函数体。(个人理解：直接async函数时，await之前的语句会立即执行，触发await的异步操作完成后，再执行后面的语句)

## ES5/ES6 的继承除了写法以外还有什么区别
[1]与函数声明不同，类声明不会提升
[2] ES5 和 ES6 子类 this 生成顺序不同。ES5 的继承先生成了子类实例，再调用父类的构造函数修饰子类实例，ES6 的继承先生成父类实例，再调用子类的构造函数修饰父类实例。这个差别使得 ES6 可以继承内置对象。
[3] class声明内部会启用严格模式
[4] class 的所有方法（包括静态方法和实例方法）都是不可枚举的。
[5] class 的所有方法（包括静态方法和实例方法）都没有原型对象 prototype，所以也没有[[construct]]，不能使用 new 来调用。
[6] 必须使用new调用class
[7] class内部无法重写类名


# HTML
## 1、语义化标签
1、对机器友好，更适合搜索引擎爬取有效信息，有利于SEO优化，支持读屏软件，根据文章自动生成目录。  
2、对开发者比较友好，开发者可以清晰的看出网页的结构，便于团队的开发与维护。  
3、常见的语义化标签：header、footer、nav、main、article、aside
## 2、DOCTYPE的作用
1、告诉浏览器以什么样的文档类型定义来解析文档。  
2、浏览器渲染页面的模式：CSS1Compat：标准模式--按照浏览器支持的最高标准展示、BackCompat：怪异模式（混杂模式）--向后兼容的方式展示
## 3、script标签中的defer和async的区别
相同点：defer和async属性都是异步加载外部的js脚本文件、它们不会阻塞页面的解析。  
区别：1、执行顺序：多个带async属性的标签，不能保证加载的顺序；多个带defer属性的标签，按照加载顺序执行。2、async属性，表示后续文档的加载和执行与js脚本的加载和执行是并行进行的；defer属性，加载后续文档的过程和js脚本的加载（仅加载不执行）是并行进行的，js脚本需要等到所有元素解析完成之后执行.  

![diff](https://cdn.nlark.com/yuque/0/2020/png/1500604/1603547262709-5029c4e4-42f5-4fd4-bcbb-c0e0e3a40f5a.png)
## 4、常用的meta标签
[1]、charset：描述HTML文档的编码类型.  
[2]、keyword：页面关键词。  
[3]、description：页面描述
[4]、refresh：页面重定向和刷新
[5]、viewport：适配移动端，控制视口的大小和比例
## 5、HTML5有哪些新更新
[1]、语义化标签  
[2]、媒体标签：audio、video、source  
[3]、表单  
[4]、进度条（progress）、度量器（meter）  
[5]、DOM查询操作  
[6]、web存储：localStorage、sessionStorage  
[7]、canvas、websocket、Geolocation（位置）、draggable（拖放）  
## 6、iframe的优点和缺点
优点：  
· 加载速度较慢的内容  
· 可以使用脚本并行下载  
· 可以实现跨子域通信  
缺点：  
· iframe会阻塞主页面的onload事件
· 无法被一些搜索引擎识别
· 不易管理
## 7、Canvas和SVG的区别
SVG:  
· 不依赖分辨率   
· 支持事件处理器  
· 适合带有大型渲染区域的应用程序  
· 复杂度高会减慢渲染速度  
· 不适合游戏应用  
Canvas：  
· 依赖分辨率  
· 不支持事件处理器  
· 文本渲染能力弱  
· 能够以.PNG .JPG格式保存结果图像   
· 适合图像密集的游戏  
## 8、渐进增强和优雅降级
· 渐进增强：针对低版本的浏览器进行页面重构，保证基本的更能情况下，在针对高级浏览器进行效果、交互等方面的改进和追加功能，以达到更好的用户体验  
· 优雅降级：开始就构建完成的功能、再针对低版本浏览器进行兼容
## HTML5 drag（拖放）
· dragStart：事件主体是被拖放元素，在开始拖放被拖放元素时触发  
· drag：事件主体是被拖放元素，在正在拖放被拖放元素时触发（过程）  
· dragenter：事件主体是目标元素，在被拖放元素进入某元素时触发  
· dragover： 事件主体是目标元素，在被拖放元素在某元素中移动时触发  
· dragleave：事件主体是目标元素，在被拖放元素移出某元素时触发  
· drop：事件主体是目标元素，在目标元素完全接受被拖放元素时触发  
· deagend： 事件主题是被拖放元素，在整个拖放操作结束时触发  

# CSS
## 1、CSS选择器
id选择器、类选择器、属性选择器、伪类选择器、伪元素选择器、标签选择器、相邻兄弟选择器、子选择器、后代选择器、通配符选择器
## 2、link和@import的区别
link：  
· 除了加载css外，还可以定义RSS等其他事务  
· 引用css时，页面同时加载  
· 无兼容问题    
· 支持js控制DOM改变样式  
@import：  
· 只能加载css  
· 需要等网页完全加载之后加载css  
· 低版本浏览器不支持  
· 不支持js控制DOM改变样式
## 3、transition和animation的区别
· transition是过渡属性，强调过渡，它的实现需要触发一个事件（点击、移动）才执行动画。  
· animation：不需要触发事件，设定好之后可以自动执行，且可以循环一个动画
## 4、伪元素和伪类的区别和作用
· 伪元素：在内容元素前后插入额外的元素或者样式，这些元素实际上并不在文档中生成，仅外部可见  
· 伪类：将特殊的效果添加到特定的选择器上，不会产生新元素  
`````
a:hover { color:#fff }
a:first-child { color: #fff }
`````
## 5、标准盒模型、IE和模型
盒模型组成：margin border padding content  
标准盒模型：width和height包含padding、border、content  
IE盒模型：width和height包含content  
## 6、CSS3新特性
· 新增css选择器（:not()）  
· 圆角  
· 多列布局(multi-column layout)  
· 阴影和反射  
· 文字特效（text-shadow）  
· 文字渲染（text-decoration）  
· 线性渐变（gradient）  
· 旋转、缩放、动画、（transform）  

# JavaScript
## 1、JavaScript的数据类型
JavaScript共有8种数据类型：string、number、boolean、null、undefined、bigint、symbol、Object  
## 2、数据类型检测的方式
· typeof(数组，对象，null都会判断为object，其余判断正确)
`````
typeof 2 // number
typeof true // boolean
typeof 'str' // string
typeof [] // object
typeof function(){} // function
typeof {}  // object
typeof undefined // undefined
typeof null // object
`````
· instanceof(可以判断对象的类型)
````
[] instanceof Arrat // true
function(){} instanceof Function // true
{} instanceof Object // true
````
· constructor: 有两个作用，一是判断数据的类型，二是对象实例通过constructor对象访问它的构造函数
`````
function Fn(){}
Fn.prototype = new Array()
var f = new Fn()
console.log(f.constructor === Fn) // false
f.constructor === Array // true
`````
· Object.prototype.toString.call()
`````
const a = Object.prototype.toString;
a.call(2)  // [object Number]
a.call(true) // [object Boolean]
a.call('str') // [object String]
a.call([])  // [object Array]
a.call(function(){})  // [object Function]
a.call({})  // [object Object]
a.call(undefined) // [object Undefined]
a.call(null) // [object Null]
`````
## 3、判断数组的方式
· Object.prototyoe.toString.call(obj)  
· 通过原型链判断：obj._proto_ === Array.prototype  
· 通过ES6种的Array.isArray()判断：Array.isArray(obj)  
· 通过instanceof判断：obj instanceof Array  
· 通过Array.prototype.isPrototypeOf: Array.prototype.isPrototypeOf(obj)
## 4、null和undefined的区别
undefined代表的含义是未定义、null代表的含义是空对象
## 5、tepyof null的结果是什么，为什么？
结果为Object，js的第一个版本，所有的值都存储在32位的单元种，每个单位种包含一个小的类型标签（1-3bits）以及当前要存储值的真是数据，类型标签存储在每个单元的低位中，共有5种数据类型
`````
000: object  --- 存储的数据指向一个对象
  1: int     --- 存储的数据是一个31位的有符号整数
010: double  --- 存储的数据指向一个双精度的浮点数
100: string  --- 存储的数据指向一个字符串
110: boolean --- 存储的数据是布尔值
`````
如果最低位是1，则类型标签标志位长度只有一位，如果最低位是0，则类型标签标志位的长度为三位  
undefined的值为(-2)的30次方（超出范围的数字）
null的值是机器码NULL指针（null指针的值为0）  
所以null的类型标签也是000，和Object一样，所以会被判定为Object


