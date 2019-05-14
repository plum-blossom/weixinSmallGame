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
  // 播放音乐
  playBgm() {
    // this.bgmAudio.play()
  }

  playShoot() {
    this.shootAudio.currentTime = 0
    // this.shootAudio.play()
  }

  playExplosion() {
    this.boomAudio.currentTime = 0
    // this.boomAudio.play()
  }
}
