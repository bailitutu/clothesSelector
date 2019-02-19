var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderType:null,
    orderId:null,
    isReady:false,
    pageData:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.orderId){
      this.setData({
        orderType: options.orderType,
        orderId:options.orderId
      })
    }
    this.shopInfo = this.selectComponent("#shopInfo");
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getOrderInfo();  
  },
  getOrderInfo(){
    const { orderType, orderId} = this.data;
    orderType == '1' ? this.getPickingData(orderId) : this.getDeployData(orderId);
  },
  // 获取配货订单详情
  getPickingData(id){
    wx.showNavigationBarLoading();
    app.getPageData("/fashion/getPickingDetail", {
      orderId:id
    }, (res) => {
      this.setData({
        pageData:res,
        isReady:true
      })
      wx.hideNavigationBarLoading();
    },()=>{
      wx.hideNavigationBarLoading();
    })
  },


  // 获取调货订单详情
  getDeployData(id){
    wx.showNavigationBarLoading();
    app.getPageData("/fashion/getDeployDetail", {
      orderId: id
    }, (res) => {
      this.setData({
        pageData: res,
        isReady: true
      })
      wx.hideNavigationBarLoading();

      }, () => {
        wx.hideNavigationBarLoading();
      })
  }

})