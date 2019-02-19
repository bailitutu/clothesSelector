var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    noData:false,
    noMore:false,
    current:1,
    list:[],
    offset:1,
    scrollH: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.topTab = this.selectComponent("#topTab");
     this.setData({
       busId:options.busId
     }) 

    let that = this;
    let query = wx.createSelectorQuery();
    query.select('#list_item').boundingClientRect(function (rect) {
      that.setData({
        scrollH: rect.height
      })
    }).exec()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData();
  },

  getData(){
    let { busId,current,offset,list,noData} = this.data;
    app.getPageData('/public/getStockWarnData',{
      busId:busId,
      offset:offset,
      limit:10,
      type:current
    },(res)=>{
      if (offset == 1 && !res.stockList.length) {
        noData = true;
      } else {
        noData = false;
      }
      if (offset > 1) {
        list = list.concat(res.stockList);
      } else {
        list = res.stockList;
      }

      this.setData({
        list:list,
        noData:noData,
        noMore:res.end
      })
    })

  },

  tabTap(){
    const { current } = this.topTab.data;
    this.setData({
      current:current,
      offset:1,
      list:[],
      noMore:false,
      noData:false,
    })
    this.getData();

  },
  moreData(){
    let { offset, noMore } = this.data;
    if (noMore) return false;
    offset++;
    this.setData({
      offset: offset,
    })
    this.getData();
  }
})