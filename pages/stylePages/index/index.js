var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showNavigationBarLoading();
    // 判断是否登录
    let fbId = wx.getStorageSync('xksUserId');

    if (!fbId) {
      wx.redirectTo({
        url: '/pages/minePages/login/login',
      })
    }else{
      app.globalData.fbId = fbId;
    } 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let fbId = wx.getStorageSync('xksUserId');
    if (fbId) {
      app.getPageData('/fashion/getAddStyleData', {
        fbId: fbId
      }, (resu) => {
        app.globalData.styleTypeList = resu.styleList;
        app.globalData.labelList = resu.fbLabel;
      })
    }
    this.getData();
  },
  getData(){
    app.getData('/fashion/home',{},(res)=>{
      this.setData({
        pageData:res
      })
      wx.hideNavigationBarLoading();
    },()=>{
      wx.hideNavigationBarLoading();
    })

  },
  goPage(e){
    const {url} = e.currentTarget.dataset;
    app.goNa(url);
  }

})