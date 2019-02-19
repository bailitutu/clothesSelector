var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isReady:false,
    pageData:{},
    labelList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showNavigationBarLoading();
    this.dialog = this.selectComponent("#dialogCompo");
  },
  onShow(){
    this.getData();    
  },
  getData(){
    this.setData({
      labelList:app.globalData.labelList
    })


    app.getData('/fashion/mine',false,(res)=>{
      this.setData({
        pageData:res,
        isReady:true
      })
      wx.hideNavigationBarLoading();
    },()=>{
      wx.hideNavigationBarLoading();
    })
  },

  loginOutTap(){
    this.dialog.showDialog();
  },
  loginOut(){
      wx.removeStorageSync('xksUserId');
      app.globalData.fbId = '';
      wx.redirectTo({
        url: '/pages/minePages/login/login',
      })
  },
  // 修改头像
  changeHead() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function (res) {
        var imageSrc = res.tempFilePaths[0]
        wx.showLoading({
          title: '上传中...',
          mask: true
        })
        wx.uploadFile({
          url: app.globalData.httpUrl + '/upload/uploadFile',
          filePath: imageSrc,
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (resu) {
            let data = JSON.parse(resu.data);
            if (data.head.respCode === '0000000') {
              let url = data.body.uploadFilePath;
              that.changeHeadFn(url)

            } else {
              wx.showToast({
                title: '上传失败，请重新上传！',
              })
            }
          },
          fail: function ({ errMsg }) {

            wx.showToast({
              title: '上传失败，请重新上传！',
              icon: 'none'
            })

          }
        })

      },
      fail: function ({ errMsg }) {
        wx.showToast({
          title: '上传失败，请重新上传！',
          icon: 'none'
        })
      }
    })

  },
  changeHeadFn(fbHead) {
    app.submit('/fashion/mineChangeHead', {
      fbId: app.globalData.fbId,
      imgUrl: fbHead
    }, (res) => {
      wx.hideLoading();

      this.setData({
        fbHead: fbHead
      })
      wx.showToast({
        title: '修改成功',
      })
    })


  }


})