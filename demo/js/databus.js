import Pool from './base/pool'

let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if ( instance )
      return instance

    instance = this

    this.pool = new Pool()

    this.reset()
  }

  reset() {
    this.frame      = 0
    this.score      = 0  //分数
    this.bullets    = [] //子弹
    this.enemys     = [] //敌机
    this.animations = []
    this.gameOver   = false
  }

  /**
   * 回收敌人，进入对象池
   * 此后不进入帧循环
   */
  removeEnemey(enemy) {
    // 删除敌机数组的第一个,并返回第一的值
    let temp = this.enemys.shift()
    // 敌机数组的第一个不可见
    temp.visible = false
    // 敌机对象回收到对象池
    this.pool.recover('enemy', enemy)
  }

  /**
   * 回收子弹，进入对象池
   * 此后不进入帧循环
   */
  removeBullets(bullet) {
    // 删除子弹数组的第一个,并返回第一的值
    let temp = this.bullets.shift()
    // 子弹数组的第一个不可见
    temp.visible = false
    // 子弹对象回收到对象池
    this.pool.recover('bullet', bullet)
  }
}
