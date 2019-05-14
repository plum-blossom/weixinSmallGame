import Animation from '../base/animation'
import DataBus   from '../databus'
// 敌机图片相关设置
const ENEMY_IMG_SRC = 'images/enemy.png'
const ENEMY_WIDTH   = 60
const ENEMY_HEIGHT  = 60

const __ = {
  speed: Symbol('speed')
}

let databus = new DataBus()

function rnd(start, end){
  return Math.floor(Math.random() * (end - start) + start)
}

export default class Enemy extends Animation {
  constructor() {
    super(ENEMY_IMG_SRC, ENEMY_WIDTH, ENEMY_HEIGHT)
    // 初始化预定义爆炸的帧动画
    this.initExplosionAnimation()
  }

  init(speed) {
    this.x = rnd(0, window.innerWidth - ENEMY_WIDTH)
    this.y = -this.height

    this[__.speed] = speed

    this.visible = true
  }

  // 预定义爆炸的帧动画
  initExplosionAnimation() {
    // 爆炸图片数组
    let frames = []
    // 爆炸图片相关设置
    const EXPLO_IMG_PREFIX  = 'images/explosion'
    const EXPLO_FRAME_COUNT = 19

    for ( let i = 0;i < EXPLO_FRAME_COUNT;i++ ) {
      frames.push(EXPLO_IMG_PREFIX + (i + 1) + '.png')
    }
    // 调用扩展Animation（base下的animation.js）下的initFrames(imgList)
    this.initFrames(frames)
  }

  // 每一帧更新子弹位置
  update() {
    // y方向上加上上一步的距离
    this.y += this[__.speed]

    // 对象回收
    if ( this.y > window.innerHeight + this.height )
      databus.removeEnemey(this)
  }
}
