import Player     from './player/index'
import Enemy      from './npc/enemy'
import BackGround from './runtime/background'
import GameInfo   from './runtime/gameinfo'
import Music      from './runtime/music'
import DataBus    from './databus'

let ctx   = canvas.getContext('2d')
let databus = new DataBus()

const ENEMY_SPEED = 6

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId    = 0
    // 开始游戏
    this.restart()
  }

  restart() {
    databus.reset()

    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )

    this.bg       = new BackGround(ctx)
    this.player   = new Player(ctx)
    this.gameinfo = new GameInfo()
    this.music    = new Music()

    this.bindLoop     = this.loop.bind(this)
    this.hasEventBind = false

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if ( databus.frame % 60 === 0 ) {
      let enemy = databus.pool.getItemByClass('enemy', Enemy)
      enemy.init(ENEMY_SPEED)
      databus.enemys.push(enemy)
    }
  }

  // 全局碰撞检测
  collisionDetection() {
    let that = this

    databus.bullets.forEach((bullet) => {
      for ( let i = 0, il = databus.enemys.length; i < il;i++ ) {
        let enemy = databus.enemys[i]

        if ( !enemy.isPlaying && enemy.isCollideWith(bullet) ) {
          // playAnimation()是播放敌机爆炸的动画，playExplosion()是播放敌机爆炸的声音
          enemy.playAnimation()
          that.music.playExplosion()

          // 子弹和敌机消失
          bullet.visible = false
          databus.score  += 1

          break
        }
        // if (bullet.owner instanceof Enemy) {
        //   databus.gameOver = this.player.isCollideWith(bullet);
        // } else if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
        //   enemy.playAnimation();
        //   that.music.playExplosion();

        //   bullet.visible = false;
        //   databus.score += 1;

        //   break;
        // }
      }
    })

    for ( let i = 0, il = databus.enemys.length; i < il;i++ ) {
      let enemy = databus.enemys[i]
      // 调用player的扩展的Sprite的isCollideWith，判断另一个精灵的中心点处于本精灵所在的矩形内
      if ( this.player.isCollideWith(enemy) ) {
        // 游戏结束
        databus.gameOver = true

        break
      }
    }
  }

  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
     e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    // gameinfo。btnArea--重新开始按钮区域
    let area = this.gameinfo.btnArea

    if (   x >= area.startX
        && x <= area.endX
        && y >= area.startY
        && y <= area.endY  )
        // 调用重启函数
      this.restart()
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.bg.render(ctx)

    databus.bullets
          .concat(databus.enemys)
          .forEach((item) => {
            // 调用调用npc下的enemy.js中扩展的Animation(base/animation)的扩展的Sprite(base/sprite)中的drawToCanvas(ctx)
              item.drawToCanvas(ctx)
            })

    // 调用player下index.js扩展base下sprite.js的drawToCanvas(ctx)
    // 将精灵图绘制在canvas上
    this.player.drawToCanvas(ctx)
    // console.log(databus.animations)
    databus.animations.forEach((ani) => {
      if ( ani.isPlaying ) {
        // 调用Enemy的扩展Animation（base下的animation.js）下的aniRender(ctx)
        // console.log(ani);
        ani.aniRender(ctx)
      }
    })
    // 调用gameinfo.js显示左上角的分数
    this.gameinfo.renderGameScore(ctx, databus.score)

    // 游戏结束停止帧循环
    if ( databus.gameOver ) {
      // 调用游戏结束弹框
      this.gameinfo.renderGameOver(ctx, databus.score)

      if ( !this.hasEventBind ) {
        this.hasEventBind = true
        // 调用touchEventHandler(e)函数
        this.touchHandler = this.touchEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.touchHandler)
      }
    }
  }

  // 游戏逻辑更新主函数
  update() {
    if ( databus.gameOver )
      return;
    // 调用runtime下的background.js中的update函数，实现背景图随敌机移动而移动
    this.bg.update()
    // 子弹数-敌机数
    databus.bullets
           .concat(databus.enemys)
           .forEach((item) => {
            //  调用npc下的enemy.js中的update函数，每一帧更新敌机和子弹的位置
              item.update() 
            })
    // 调用生成敌机函数
    this.enemyGenerate()

    // 打中30个敌机，等级+1
    this.player.level = Math.max(1,Math.ceil(databus.score/30));

    this.collisionDetection()

    if ( databus.frame % 20 === 0 ) {
      this.player.shoot()
      this.music.playShoot()
    }
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++
    // 绘制不断生成的enemy敌机
    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
    // if (databus.frame % 20 === 0) {
    //   this.player.shoot();
    //   this.music.playShoot();
    // }

    // databus.enemys.forEach(enemy => {
    //   const enemyShootPositions = [
    //     -enemy.height + ENEMY_SPEED * 5,
    //     -enemy.height + ENEMY_SPEED * 60
    //   ];
    //   if (enemyShootPositions.indexOf(enemy.y) !== -1) {
    //     enemy.shoot();
    //     this.music.playShoot();
    //   }
    // });

    // // 游戏结束停止帧循环
    // if (databus.gameOver) {
    //   this.touchHandler = this.touchEventHandler.bind(this);
    //   canvas.addEventListener("touchstart", this.touchHandler);
    //   this.gameinfo.renderGameOver(ctx, databus.score);

    //   return;
    // }

    // window.requestAnimationFrame(this.loop.bind(this), canvas);
  }
}
