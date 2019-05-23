const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

let atlas = new Image()
atlas.src = 'images/Common.png'

export default class GameInfo {
  // 左上角的分数显示
  renderGameScore(ctx, score) {
    // 字体颜色大小设置
    ctx.fillStyle = "#ffffff"
    ctx.font      = "20px Arial"
    // 填充文本设置
    ctx.fillText(
      "分数:"+score,//文本-分数
      10, //x轴位置
      30 //y轴位置
    )
  }
  // 玩家等级文本显示
  renderPlayerLevel(ctx,level){
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"
    // 填充文本设置
    ctx.fillText(
      "等级:"+level,//文本-分数
      100, //x轴位置
      30 //y轴位置
    )
  }
  // 游戏结束弹框
  renderGameOver(ctx, score) {
    /**
    ctx.drawImage(
      要绘制的图片资源，
      图片的左上角在目标canvas上X轴的位置，
      图片的左上角在目标canvas上Y轴的位置，
      在目标画布上绘制图像的宽度，
      在目标画布上绘制图像的高度，
      原图像的矩形选择框的左上角X坐标，
      原图像的矩形选择框的左上角Y坐标，
      原图像的矩形选择框的宽度，
      原图像的矩形选择框的高度
      )
    */
    ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 100, 300, 300)

    ctx.fillStyle = "#ffffff"
    ctx.font    = "20px Arial"

    ctx.fillText(
      '游戏结束',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 50
    )

    ctx.fillText(
      '得分: ' + score,
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 130
    )

    ctx.drawImage(
      atlas,
      120, 6, 39, 24,
      screenWidth / 2 - 60,
      screenHeight / 2 - 100 + 180,
      120, 40
    )

    ctx.fillText(
      '重新开始',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 205
    )

    /**
     * 重新开始按钮区域
     * 方便简易判断按钮点击
     */
    this.btnArea = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 - 100 + 180,
      endX  : screenWidth / 2  + 50,
      endY  : screenHeight / 2 - 100 + 255
    }
  }
}

