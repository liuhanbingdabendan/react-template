// 防抖 触发高频事件后n秒内函数只会执行一次，如果n秒内高频事件再次触发，则重新计算时间
function debounce(fn, time) {
  let timeout = null;
  return function () {
    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this);
    }, time)
  }
}
// 节流
function throttle(fn, time) {
  let canRun = true;
  return function () {
    if (!canRun) return;
    canRun = false;
    setTimeout(() => {
      fn.apply(this);
      canRun = true;
    }, time)
  }
}

// 2、Set、Map、WeatSet、WeakMap区别
// Set
// ES6新增的一种数据结构，类似于数组， 成员是唯一并且无序的，其判断两个值是否不同，使用的算法叫做"Same-value-zero equality", 类似于精确相等运算符(===), 主要区别在于这个算法NaN等于自身，精确运算符认为NaN不等于自身
// const s = new Set()
// [1, 2, 3, 4, 3, 2, 1].forEach(x => s.add(x))

// for (let i of s) {
//     console.log(i)	// 1 2 3 4
// }

// // 去重数组的重复对象
// let arr = [1, 2, 3, 2, 1, 1]
// [... new Set(arr)]	// [1, 2, 3]

// WeatSet

// WeakSet 对象允许你将弱引用对象储存在一个集合中
// WeakSet 与 Set 的区别：
// WeakSet 只能储存对象引用，不能存放值，而 Set 对象都可以
// WeakSet 对象中储存的对象值都是被弱引用的，即垃圾回收机制不考虑 WeakSet 对该对象的应用，
// 如果没有其他的变量或属性引用这个对象值，则这个对象将会被垃圾回收掉（不考虑该对象还存在于 WeakSet 中），
// 所以，WeakSet 对象里有多少个成员元素，取决于垃圾回收机制有没有运行，运行前后成员个数可能不一致，
// 遍历结束之后，有的成员可能取不到了（被垃圾回收了），WeakSet 对象是无法被遍历的（ES6 规定 WeakSet 不可遍历），也没有办法拿到它包含的所有元素

// Map
// 集合 与 字典 的区别：

// 共同点：集合、字典 可以储存不重复的值
// 不同点：集合 是以 [value, value]的形式储存元素，字典 是以 [key, value] 的形式储存

// WeakMap
// WeakMap 对象是一组键值对的集合，其中的键是弱引用对象，而值可以是任意。
// 注意，WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用。
// WeakMap 中，每个键对自己所引用对象的引用都是弱引用，在没有其他引用和该键引用同一对象，这个对象将会被垃圾回收（相应的key则变成无效的），所以，WeakMap 的 key 是不可枚举的。

// Set
// 成员唯一、无序且不重复
// [value, value]，键值与键名是一致的（或者说只有键值，没有键名）
// 可以遍历，方法有：add、delete、has
// WeakSet
// 成员都是对象
// 成员都是弱引用，可以被垃圾回收机制回收，可以用来保存DOM节点，不容易造成内存泄漏
// 不能遍历，方法有add、delete、has
// Map
// 本质上是键值对的集合，类似集合
// 可以遍历，方法很多可以跟各种数据格式转换
// WeakMap
// 只接受对象作为键名（null除外），不接受其他类型的值作为键名
// 键名是弱引用，键值可以是任意的，键名所指向的对象可以被垃圾回收，此时键名是无效的
// 不能遍历，方法有get、set、has、delete

function sayHi() {
  console.log('你猜防不防抖');
}
function sayHiYou(e) {
  console.log('你猜节不节流');
}

var inp = document.getElementById('inp');
inp.addEventListener('input', debounce(sayHi, 1000)); // 防抖
window.addEventListener('resize', throttle(sayHiYou, 2000)); // 节流

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
const node = document.querySelector('.parent');
console.log(deepTraversal1(node))
console.log(node);

// async function async1() {
//     console.log('async1 start');
//     await async2();
//     console.log('async1 end');
// }
// async function async2() {
//     console.log('async2');
// }
// console.log('script start');
// setTimeout(function() {
//     console.log('setTimeout');
// }, 0)
// async1();
// new Promise(function(resolve) {
//     console.log('promise1');
//     resolve();
// }).then(function() {
//     console.log('promise2');
// });
// console.log('script end');

// 'script start' ->  'async1 start' -> 'async2' -> 'promise1' ->  'script end'  -> 'promise2' -> 'async1 end' -> 'setTimeout'