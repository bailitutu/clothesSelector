var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:1, //1：款式；2：颜色
    list:[],
    noData:false,
    noMore:false,
    busId:null,
    pageType:0, //0为总缺少单款单色；1：店铺缺少单款单色
    scrollH:0
  },

  onLoad:function(options){
    this.topTab = this.selectComponent("#topTab");
    if (options.pageType){
      this.setData({
        pageType: 1,
        busId: options.busId
      })
    }
    let that = this;
    let query = wx.createSelectorQuery();
    query.select('#list_item').boundingClientRect(function (rect) {
      that.setData({
        scrollH: rect.height
      })
    }).exec()

  },

  onShow: function () {
    this.getList();
  },
  getList(){
    let { current, busId, pageType, noData} = this.data;
    const fbId = app.globalData.fbId;
    let postData={};
    if(!pageType){
      postData = {
        fbId:fbId,
        type: current
      }
    }else{
      postData = {
        busId: busId,
        type: current
      }
    }
    app.getPageData('/fashion/getBusSkuData',postData,(res)=>{

        if (!res.skuList || !res.skuList.length) {
          noData = true;
        }else{
          noData = false;
        }
        this.setData({
          list: res.skuList,
          noData:noData,
          noMore:true
        })

    })
    
  },

  tabTap(){
    const { current } = this.topTab.data;
    this.setData({
      current: current,
      list:[],
      noData:false,
      noMore:false
    })
    this.getList();
  }
})