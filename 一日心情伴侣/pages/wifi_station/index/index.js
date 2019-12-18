//index.js
//获取应用实例
const app = getApp()

Page({

  data: {
    motto: '请自拍一张吧~',
    tempFilePaths: null,
  },

  onLoad: function () {
    wx.showModal({
      title: '心情判断',
      content: '请上传一张正脸照片，展现自己真实的心情。'
    })
  },
  //确定图片来源，从相册中选择或者是拍照
  chooseImage: function () {
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#CED63A",
      success: (res) => {
        if (res.cancel) {
          return;
        }
        if (res.tapIndex == 0) {
          this.chooseWxImage('album')
        } else if (res.tapIndex == 1) {
          this.chooseWxImage('camera')
        }
      }
    })

  },

  //选择图片
  chooseWxImage: function (type) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: (res) => {
        this.setData({
          tempFilePaths: res.tempFilePaths,
        })
      }
    })
  },

  //上传图片至服务器并接受返回的结果
identifyImage: function () {
    if(!this.data.tempFilePaths) {
      console.error("no selected image")
      return ;
    }
    
    /**
     * 调用微信上传文件接口, 此处向我们的腾讯云服务器发送请求
     */
    wx_face({
      wx:chooseImage({
        success(res) {
          const tempFilePaths = res.tempFilePaths
          wx.uploadFile({
            url: 'https://weixin.techeek.cn/', //替换为你自己的接口地址
            header: {
              'Content-Type': 'application/json'
            },
            filePath: this.data.tempFilePaths[0],
            name: 'file',
          })
        }
      }),
      success: (res) => {
        var data = JSON.parse(res.data) //把返回结果解析成json格式
        console.log(data)
        if (data.code === -9021) {
          wx.showModal({
            title: '上传成功',
            content: `但是看不太出来，可以在拍一张看看嘛`
          })
          return;
        }
      }
    })
 
        if (data.code !== 0) {
          //识别失败，提示上传质量更好的图片
          wx.showModal({
            title: '上传失败',
            content: `${data.message}`
          })
          return;
        }
        //识别成功，拼接识别结果并显示
        var list = data.data.items;
        var str = list.map(i => i.itemstring).join(" ");
        this.setData({
          motto: str
        })
        if (processedStr !== '') {//判断人脸的参数
          wx.showModal({
            title: '提示',
            content: '图片中不是人脸, 请重新上传正脸照片 '
          })
          return;
        }
        if (processedStr == '') {//判断笑脸的参数为forse
          wx.showModal({
            title: '提示',
            content: '今天心情不好吗？你知道吗，分享悲伤，悲伤可以减半哦！摸摸头~愿你被这个世界温柔以待'
          })
          return;
        }
        else {//判断笑脸的参数为true
          wx.showModal({
            title: '提示',
            content: '今天的你很开心呦，可以将你的快乐分享给我吗？你知道吗，快乐被分享，幸福是会加倍的！'
          })
          return;
        }
   }
 })