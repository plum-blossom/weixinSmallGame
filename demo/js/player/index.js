import Sprite   from '../base/sprite'
import Bullet   from './bullet'
import DataBus  from '../databus'
// 屏幕宽高
const screenWidth    = window.innerWidth
const screenHeight   = window.innerHeight

// 玩家相关常量设置
const PLAYER_IMG_SRC = 'images/hero.png'
const PLAYER_WIDTH   = 80
const PLAYER_HEIGHT  = 80

let databus = new DataBus()

export default class Player extends Sprite {
  constructor() {
    super(PLAYER_IMG_SRC, PLAYER_WIDTH, PLAYER_HEIGHT)

    // 玩家默认处于屏幕底部居中位置
    this.x = screenWidth / 2 - this.width / 2
    this.y = screenHeight - this.height - 30

    // 用于在手指移动的时候标识手指是否已经在飞机上了
    this.touched = false

    // 子弹数组集合
    this.bullets = []

    // 调用初始化事件监听
    this.initEvent()

    
  }
  /**
    * 等级逻辑
    * 玩家初始等级为1，玩家可通过击杀敌机升级，每击落30敌机升级一次
    * 玩家每升级一次，增加一个射击口
    * 玩家最多升级两次
    */
  get level() {//获取main.js中的this.player.level
    return databus.palyerLevel;
  }
  set level(level){
    databus.palyerLevel = Math.min(level,3);
  }
  
  
  /**
   * 当手指触摸屏幕的时候
   * 判断手指是否在飞机上
   * @param {Number} x: 手指的X轴坐标
   * @param {Number} y: 手指的Y轴坐标
   * @return {Boolean}: 用于标识手指是否在飞机上的布尔值
   */
  checkIsFingerOnAir(x, y) {
    const deviation = 30 
    
    return !!(   x >= this.x - deviation
              && y >= this.y - deviation
              && x <= this.x + this.width + deviation
              && y <= this.y + this.height + deviation  )
  }

  /**
   * 根据手指的位置设置飞机的位置
   * 保证手指处于飞机中间
   * 同时限定飞机的活动范围限制在屏幕中
   */
  setAirPosAcrossFingerPosZ(x, y) {
    // x,y为触屏时手指在飞机位置坐标
    // 飞机的中心在x，y减去飞机本身宽高的一半，就可限定飞机的活动范围限制在屏幕中
    let disX = x - this.width / 2
    let disY = y - this.height / 2

    if ( disX < 0 )
      disX = 0

    else if ( disX > screenWidth - this.width )
      disX = screenWidth - this.width

    if ( disY <= 0 )
      disY = 0

    else if ( disY > screenHeight - this.height )
      disY = screenHeight - this.height
    // 将限制后的中心位置赋值于默认中心位置
    this.x = disX
    this.y = disY
  }

  /**
   * 玩家响应手指的触摸事件
   * 改变战机的位置
   */
  initEvent() {
    // 监听canvas的触摸事件
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()
      // 获取手指初始位置
      let x = e.touches[0].clientX
      let y = e.touches[0].clientY

      //调用判断手指是否在飞机上函数
      if ( this.checkIsFingerOnAir(x, y) ) {
        // 是-设置触摸状态为true
        this.touched = true
        // 调用飞机设置和操作，限制范围函数
        this.setAirPosAcrossFingerPosZ(x, y)
      }

    }).bind(this))
    // 监听canvas的触摸移动事件
    canvas.addEventListener('touchmove', ((e) => {
      e.preventDefault()

      let x = e.touches[0].clientX
      let y = e.touches[0].clientY
       // 判断触摸状态，是-调用飞机设置和操作，限制范围函数
      if ( this.touched )
        this.setAirPosAcrossFingerPosZ(x, y)

    }).bind(this))
    // 监听canvas的触摸结束事件
    canvas.addEventListener('touchend', ((e) => {
      e.preventDefault()
      // 设置触摸状态为false
      this.touched = false
    }).bind(this))
  }

  /**
   * 玩家射击操作
   * 射击时机由外部决定
   */
  shoot() {
    /**
    let bullet = databus.pool.getItemByClass('bullet', Bullet)

    bullet.init(
      this.x + this.width / 2 - bullet.width / 2,
      this.y - 10,
      10
    )
    databus.bullets.push(bullet)
    */
    /**
     * 修改玩家射击操作
     * 玩家1级时只有中间的射击口，2级有左边和中间的射击口，3级有左中右三个射击口
     */
    for(let i=0;i<this.level;i++){
      // 获取对象池的子弹
      const bullet = databus.pool.getItemByClass('bullet', Bullet);
      // 初始炮口为中间的位置 (this.x + this.width / 2)=屏幕的一半
      const middle = this.x + this.width / 2 - bullet.width / 2;
      // !0--true !1--false 左右炮口的x位置 level=2增加左炮口，level=3增加右炮口
      const x = !i ? middle : (i % 2 === 0 ? middle + 30 : middle - 30);
      // 子弹初始化-调用bullet.js下的初始化位置和速度函数init(x, y, speed)
      bullet.init(
        x,
        this.y - 10,
        10
      )
      // 将子弹添加到子弹数组中
      databus.bullets.push(bullet)
    }
  }
}
