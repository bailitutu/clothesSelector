var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      index:0,
      monthArray: ['6月', '6月', '6月', '6月', '6月', '6月', '6月'],
      busInfo:{},
      busId:null,
      monthSalePrice:0,
      isReady: true,
      monthSaleNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({
       busId:options.busId
     })   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getPageData();
  },

  // 获取商户详情
  getPageData(){
    const {busId} = this.data;
    wx.showNavigationBarLoading();
    app.getPageData('/fashion/getBusDetail',{
      busId:busId
    },(res)=>{
      let monthArr = [];
        
      if (res.busSalesArray){
        res.busSalesArray.map((item)=>{
          monthArr.push(item.month)
        })
      }
      wx.setNavigationBarTitle({
        title: res.busName || '商户详情'
      })
      this.setData({
        busInfo:res,
        monthArray: monthArr,
        monthSalePrice: res.busSalesArray[0].price,
        monthSaleNum: res.busSalesArray[0].num,
        isReady:true
      })
      wx.hideNavigationBarLoading();
    },()=>{
      wx.hideNavigationBarLoading();
    })

  },

  // 查看各月销售情况
  checkMonthSales(e){
    const index = e.detail.value;
    const { busInfo} = this.data;
    const salesArray = busInfo.busSalesArray;
    this.setData({
      index: index,
      monthSalePrice: salesArray[index].price,
      monthSaleNum: salesArray[index].num,
    })
  },

  // 查看缺少单款单色
  checkLack(){
    const { busId } = this.data;
    wx.navigateTo({
      url: app.globalData.url['缺少单款单色'] + '?busId=' + busId +'&pageType=1',
    })
  },
  // 查看缺少单款单色
  checkStock(){
    const { busId } = this.data;
    wx.navigateTo({
      url: app.globalData.url['库存预警'] + '?busId=' + busId,
    })
  },
  checkCollect(){
    const { busId } = this.data;
    wx.navigateTo({
      url: app.globalData.url['统计图表'] + '?busId=' + busId,
    })

  }
})