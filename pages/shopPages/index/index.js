var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allLackColorNum:0, //总缺少单款单色
    shopList:[],//商户列表 
    query:'',
    offset:1,
    limit:10,
    filterType:0,
    noMore:false,
    noData:false,
    scrollH: 0
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getShopList();
    let that = this;
    let query = wx.createSelectorQuery();
    query.select('#list_item').boundingClientRect(function (rect) {
      that.setData({
        scrollH: rect.height
      })

    }).exec()
  },
  // 获取页面数据
  getShopList(){
    let { query, filterType, offset, shopList, noData, limit} = this.data;
    app.getData('/fashion/getBusData',{
      query:query,
      type:filterType,
      offset:offset,
      limit:limit
    },(res)=>{

      if (offset == 1 && !res.busList.length) {
        noData = true;
      }else{
        noData = false;
      }
      if (offset > 1) {
        shopList = shopList.concat(res.busList);
      } else {
        shopList = res.busList;
      }
      this.setData({
        allLackColorNum: res.allLackColorNum,
        shopList: shopList,
        noMore:res.end,
        noData: noData,
        query:''
      })
    })


  },
  // 加载更多
  moreData(){
    let { offset, noMore } = this.data;
    if (noMore) return false;
    offset++;
    this.setData({
      offset: offset,
    })
    this.getShopList();
  } ,
  // 输入搜索信息
  inputSearch(e){
    this.setData({
      query:e.detail.value,
    })
  } ,
  // 搜索店铺
  searchShop(){
    this.setData({
      offset: 1,
      shopList: [],
    })
    this.getShopList();
  },

  // 筛选
  filterTap(e){
    const { type } = e.currentTarget.dataset;
    this.setData({
      filterType:type,
      offset:1,
      noMore: false,
      noData: false,
      shopList:[],
    });
    this.getShopList();
  },
  // 查看总缺少单款单色
  checkLack(){
    app.goNa("缺少单款单色")
  },
  // 查看商户详情 
  checkBusDetail(e){
    const { busid } = e.currentTarget.dataset;
    wx.navigateTo({
      url: app.globalData.url['商户详情'] + '?busId=' + busid
    })
  }


})