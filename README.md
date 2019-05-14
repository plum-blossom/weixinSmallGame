# weixinSmallGame
微信小游戏开发的相关记载
## 微信提供飞机对战demo解析
### 源码目录介绍
```
│  game.js  //游戏入口
│  game.json //游戏配置文件
│  project.config.json //项目配置文件
│
├─audio //音频文件
│      bgm.mp3
│      boom.mp3
│      bullet.mp3
│
├─images //图片资源文件
│      bg.gif
│      bg.jpg
│      bullet.png
│      Common.png
│      enemy.png
│      explosion1.png
│      explosion10.png
│      explosion11.png
│      explosion12.png
│      explosion13.png
│      explosion14.png
│      explosion15.png
│      explosion16.png
│      explosion17.png
│      explosion18.png
│      explosion19.png
│      explosion2.png
│      explosion3.png
│      explosion4.png
│      explosion5.png
│      explosion6.png
│      explosion7.png
│      explosion8.png
│      explosion9.png
│      hero.png
│
└─js
├── base                                   // 定义游戏开发基础类
│   ├── animatoin.js                       // 帧动画的简易实现
│   ├── pool.js                            // 对象池的简易实现
│   └── sprite.js                          // 游戏基本元素精灵类
├── libs
│   ├── symbol.js                          // ES6 Symbol简易兼容
│   └── weapp-adapter.js                   // 小游戏适配器
├── npc
│   └── enemy.js                           // 敌机类
├── player
│   ├── bullet.js                          // 子弹类
│   └── index.js                           // 玩家类
├── runtime
│   ├── background.js                      // 背景类
│   ├── gameinfo.js                        // 用于展示分数和结算界面
│   └── music.js                           // 全局音效管理器
├── databus.js                             // 管控游戏状态
└── main.js                                // 游戏入口主函数

```
### 运行环境
* iOS:JavaScriptCore
* Android:V8
#### 都是没有BOM、DOM的运行环境，没有全局的document和window对象，因此使用DOM API来创建Canvas和Image等元素时，会引发错误。
### 准备了解
* weapp-adapter:wx API 模拟 BOM 和 DOM 的代码组成的库称之为 Adapter,是对基于浏览器环境的游戏引擎在小游戏运行环境下的一层适配层，使游戏引擎在调用 DOM API 和访问 DOM 属性时不会产生错误。是为了与浏览器中DOM，BOM的概念兼容而写的
* symbol.js:对于ES6中Symbol的极简兼容,方便模拟私有变量
* game.js:游戏入口文件
* game.json:游戏配置文件
* main.js:游戏主函数，包括整个打飞机的游戏场景、参与者（玩家飞机和敌方飞机）、游戏逻辑
### 构思
#### 游戏主逻辑tu
![图片](1.png)
在loop中，玩家每隔20帧射击一次，每隔60帧生成新的敌机。每帧检查玩家和敌机是否死亡，玩家死亡游戏结束，敌机死亡分数+1.只有玩家可以射击，且射击方式固定，通过躲避敌机生存。
### 分析
> game.js 游戏入口	

```
import './js/libs/weapp-adapter' //兼容浏览器的DOM和BOM的概念
import './js/libs/symbol'

import Main from './js/main'

new Main()

```
> main.js 主函数

```
import Player     from './player/index' 	//玩家
import Enemy      from './npc/enemy' //敌机
import BackGround from './runtime/background'	//背景
import GameInfo   from './runtime/gameinfo'  //分数和结束页面
import Music      from './runtime/music'	背景音乐
import DataBus    from './databus'		//管控游戏状态
//创建canvas
let ctx   = canvas.getContext('2d')
```

> base/sprite.js  游戏基本元素精灵类

* 精灵的图片、宽高、位置、是否可见
* drawToCanvas(ctx) 将精灵图绘制在canvas上
* isCollideWith(sp) 简单的碰撞检测定义： 另一个精灵的中心点处于本精灵所在的矩形内即可

> base/pool.js 对象池

* 对象的存贮和重复使用，可以有效减少对象创建开销和避免频繁的垃圾回收，提高游戏性能
* getPoolBySign(name) 根据对象标识符，获取对应的对象池
* getItemByClass(name, className) 根据传入的对象标识符，查询对象池，对象池为空创建新的类，否则从对象池中取
* recover(name, instance) 将对象回收到对象池，方便后续继续使用

> databus.js 管控游戏状态

* let instance 全局变量
* this.pool = new Pool() 创建对象池
* reset() 重置
```
reset() {
    this.frame      = 0
    this.score      = 0  //分数
    this.bullets    = [] //子弹
    this.enemys     = [] //敌机
    this.animations = []
    this.gameOver   = false
  }
```
*  removeEnemey(enemy) 回收敌机到对象池
*   removeBullets(bullet) 回收子弹到对象池