# TCP协议：如何保证页面文件能完整送达浏览器
衡量web页面性能的一个重要指标---FP(first paint)，指从页面加载到首次开始绘制的时长，这个指标直接影响了用户的跳出率，更快的页面响应意味着更多的PV，更高的参与度以及更高的转化率。
### 影响FP指标的一个重要因素---网络加载速度

## 一个数据包的旅程
### 1、IP：把数据包送达目的的主机
![diff](https://static001.geekbang.org/resource/image/00/4d/00d9bcad0bda1fdb43ead428e89ae74d.png)
主机a-->主机b的流程  
· 上层将含有极客时间的数据包交给网络层  
· 网络层再将IP头附加到数据包上，组成新的IP数据包，交给底层  
· 底层通过物理网络将数据包传输给主机b  
· 数据包被传输到主机b的网络层，在这里主机b拆开数据包的IP头信息，并将拆来的数据部分交给上层  
· 最终，含有极客时间信息的数据包就到达主机b的上层了  
### 2、UDP：把数据包送达应用程序
UDP(user datagram protocol)
![diff](https://static001.geekbang.org/resource/image/3e/ea/3edb673a43f23d84253c52124ce447ea.png)
UDP不能保证数据的可靠性，但是传输速度非常快
### TCP：把数据完整的送达应用程序
对于浏览器来说UDP存在两个问题  
1、数据包在传输过程中容易丢失  
2、大文件会被拆分成很多小的数据包来传输，这些小的数据包会经过不同的路由，并在不同的事件到达接收端，而UDP协议并不知道如何组装这些数据包，从而把这些数据还原成完整的文件  
TCP的两个特点  
· 对于数据包丢失的情况，TCP提供重供机制  
· TCP引入了数据包排序机制，用来保证把乱序的数据包组合成一个完整的文件  
TCP下的单个数据包的传输流程
![diff](https://static001.geekbang.org/resource/image/94/32/943ac29f7d5b45a8861b0cde5da99032.png)
完整的TCP连接过程
![diff](https://static001.geekbang.org/resource/image/44/44/440ee50de56edc27c6b3c992b3a25844.png)
TCP为了保证数据传输的可靠性，牺牲了数据包的传输速度，因为 三次握手 和 数据包校验机制 等把传输过程中的数据包的数量提高了一倍
# HTTP请求流程
## 浏览器端发起http请求流程
### 1、构建请求
首先，浏览器构建请求行信息，构建好之后，浏览器准备发起网络请求
````
GET /index.html HTTP1.1
````
### 2、查找缓存
在真正发起网络请求之前，浏览器会先在浏览器中查询是否有要请求的文件，浏览器缓存是一种在本地保存资源副本，以供下次请求时直接使用的技术
### 3、准备IP地址和端口
http和TCP的关系：浏览器使用HTTP协议作为应用层协议，用来封装请求的文本信息；并使用TCP/IP作传输协议将它发送到网络上，所以HTTP工作之前，浏览器需要通过TCP与服务器建立连接，也就是说HTTP的内容是通过TCP的传输数据阶段来实现的
![diff](https://static001.geekbang.org/resource/image/12/80/1277f342174b23f9442d3b27016d7980.png)
HTTP网络请求的第一步：请求DNS返回域名对应的IP
### 4、等待TCP队列
chrome有个机制，同一域名下同时最多只能建立6个TCP连接，如果同时有十个请求发生，其中四个请求会进入排队等待状态，直至进行中的请求完成
### 5、建立TCP连接
排队结束之后，在http工作开始之前，浏览器通过TCP与服务器建立连接
### 6、发送http请求
一旦建立了TCP连接，浏览器就可以和服务器进行通信了，HTTP中的数据正是这个过程中传输的
![diff](https://static001.geekbang.org/resource/image/b8/d7/b8993c73f7b60feb9b8bd147545c47d7.png)
## 服务端处理HTTP请求流程
### 1、返回请求
### 2、断开连接
通常情况下，一旦服务器向客户端返回了数据，它就要关闭TCP连接，如果想要持久化连接，可以在头信息加入
````
Connection: Keep-Alive
````
这样TCP连接在发送后将仍然保持打开状态，浏览器就可以通过同一个TCP连接发送请求
### 3、重定向

## 问题
### 1、为什么很多站点第二次打开速度会很快
第二次页面打开很快，主要原因是在第一次加载页面过程中，缓存了一部分耗时的数据。主要是DNS缓存和页面资源缓存
![diff](https://static001.geekbang.org/resource/image/5f/08/5fc2f88a04ee0fc41a808f3481287408.png)