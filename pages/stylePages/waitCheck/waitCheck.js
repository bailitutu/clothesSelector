var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query:'',
    pageData:[],
    noData:false,
    noMore:false,
    scrollH:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData();
    let that = this;
    let query = wx.createSelectorQuery();
    query.select('#list_item').boundingClientRect(function (rect) {
      that.setData({
        scrollH: rect.height
      })
    }).exec()
  },

  getPageData(){
    let {query,noData} = this.data;
    app.getData('/fashion/getNoReviewData',{
      styleName:query
    },(res)=>{
      if (!res.NoReviewList.length){
        noData = true
      } else {
        noData = false;
      }
      this.setData({
        pageData: res.NoReviewList,
        noMore:true,
        noData: noData
      })
    })


  },

  // 搜索
  searchTap(e){
    this.setData({
      query: e.detail,
      pageData:[]
    })
    this.getPageData();
  }

})