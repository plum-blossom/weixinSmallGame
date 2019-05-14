import Sprite   from '../base/sprite'
import Bullet   from './bullet'
import DataBus  from '../databus'

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

    this.bullets = []

    // 初始化事件监听
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

      //判断手指是否在飞机上
      if ( this.checkIsFingerOnAir(x, y) ) {
        this.touched = true
        // 飞机设置和操作，限制范围
        this.setAirPosAcrossFingerPosZ(x, y)
      }

    }).bind(this))

    canvas.addEventListener('touchmove', ((e) => {
      e.preventDefault()

      let x = e.touches[0].clientX
      let y = e.touches[0].clientY

      if ( this.touched )
        this.setAirPosAcrossFingerPosZ(x, y)

    }).bind(this))

    canvas.addEventListener('touchend', ((e) => {
      e.preventDefault()

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
      const bullet = databus.pool.getItemByClass('bullet', Bullet);
      const middle = this.x + this.width / 2 - bullet.width / 2;
      const x = !i ? middle : (i % 2 === 0 ? middle + 30 : middle - 30);
      // 子弹初始化
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
