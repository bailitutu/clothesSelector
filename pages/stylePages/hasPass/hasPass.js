var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     query:'',
     noMore:false,
     noData:false,
     list:[],
     offset:1,
    scrollH: 0
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
    let { offset ,noData,noMore,query,list} = this.data;
    
    app.getData('/fashion/getHasPassData',{
      offset:offset,
      limit:10,
      styleName:query
    },(res)=>{
      if (offset == 1 && !res.hasPassList.length) {
        noData = true;
      } else {
        noData = false;
      }
      if (offset > 1) {
        list = list.concat(res.hasPassList);
      } else {
        list = res.hasPassList;
      }
      this.setData({
        noData:noData,
        noMore:res.end,
        list:list,
      })

    })


  },
  // 加载更多
  moreData() {
    let { offset, noMore } = this.data;
    if (noMore) return false;
    offset++;
    this.setData({
      offset: offset,
    })
    this.getPageData();
  },

  searchOrder(e){
    this.setData({
      query:e.detail,
      list:[]
    })
    this.getPageData();
  },

  checkDetail(e){
    const {id} = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/stylePages/matchDetail/matchDetail?id='+ id,
    })

  }

  
})