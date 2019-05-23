let instance

/**
 * 统一的音效管理器
 */
export default class Music {
  constructor() {
    if ( instance )
      return instance

    instance = this
    // 背景音乐添加
    this.bgmAudio = new Audio()
    this.bgmAudio.loop = true
    this.bgmAudio.src  = 'audio/bgm.mp3'

    this.shootAudio     = new Audio()
    this.shootAudio.src = 'audio/bullet.mp3'

    this.boomAudio     = new Audio()
    this.boomAudio.src = 'audio/boom.mp3'

    this.playBgm()
  }
  // 播放背景音乐函数
  playBgm() {
    // this.bgmAudio.play()
  }
  // 播放射击音乐函数
  playShoot() {
    this.shootAudio.currentTime = 0
    // this.shootAudio.play()
  }
  // 播放玩家爆炸音乐函数
  playExplosion() {
    this.boomAudio.currentTime = 0
    // this.boomAudio.play()
  }
}
