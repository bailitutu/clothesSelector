var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:1,//1 :配货；2：调货；
    query:'', //搜索项
    pickingType:0,//订单类型 0:全部
    pickingOffset:1,  //当前页码
    pickingData:[],  //配货订单
    pickingNoData:false,
    pickingTypeList: ["全部订单", "待发货", "待收货", "已收货", "交易关闭"],
    pickingNoMore:false,

    deployType: 0,//订单类型    
    deployOffset:1, //调货页码
    deployData:[],
    deployNoData:false,
    deployTypeList: ["全部订单", "待确认", "待收货", "已收货", "交易关闭"],
    deployNoMore: false,
    scrollH: 0,
  },
  onReady: function () {
    this.topSearch = this.selectComponent("#topSearch");
    this.shopInfo = this.selectComponent("#shopInfo");
    this.topTab = this.selectComponent("#topTab");
    let that = this;
    let query = wx.createSelectorQuery();
    query.select('#list_item').boundingClientRect(function (rect) {
      that.setData({
        scrollH: rect.height
      })
    }).exec()
  },
  // 搜索
  searchOrder(e){
    const { current } = this.data;
      this.setData({
        query:e.detail,
        orderType:0,
      })

      if(current == "1"){
        this.setData({
          query: e.detail,
          pickingType: 0,
          pickingOffset: 1,  //当前页码
          pickingData: [],  //配货订单
          pickingNoData: false,
          pickingNoMore: false,
        })
        this.getPickingData();
      }else{
        this.setData({
          query: e.detail,
          deployType: 0,
          deployOffset: 1, //调货页码
          deployData: [],
          deployNoData: false,
          deployNoMore: false,
        })
        this.getDeployData();
      }
  },


  onShow: function () {
    this.getPickingData()
 
  },
  tabTap(){
    const {current} = this.topTab.data;
    this.setData({
      current:current,
      query: '', //搜索项
      pickingType: 0,//订单类型 0:全部
      pickingOffset: 1,  //当前页码
      pickingData: [],  //配货订单
      pickingNoData: false,
      pickingNoMore: false,

      deployType: 0,//订单类型    
      deployOffset: 1, //调货页码
      deployData: [],
      deployNoData: false,
      deployNoMore: false,
    })
    if( current == 1){
      this.getPickingData();
    }else{
      this.getDeployData();
    }
  },

  // 获取配货数据
  getPickingData(){
    let that = this;
    let { query, pickingOffset, pickingType, pickingTypeList, pickingData} = this.data;
    let  newPickingNoData = false;
    app.getData('/fashion/getPickingData',{
      query:query,
      type:pickingType,
      offset:pickingOffset,
      limit:10
    },(res)=>{
      if (pickingOffset == 1 && !res.orderList.length){
        newPickingNoData = true;
      }
      if (pickingOffset > 1 ){
        pickingData = pickingData.concat(res.orderList);
      }else{
        pickingData = res.orderList;
      }
      this.setData({
        pickingData: pickingData,
        pickingNoData: newPickingNoData,
        pickingNoMore: res.end
      });
    })
  },

  // 选择配货订单类型
  pickingFilter(){
    let that = this;
    const { pickingTypeList} = this.data;
    wx.showActionSheet({
      itemList: pickingTypeList,
      itemColor:"#707070",
      success(res){
        that.setData({
          pickingType:res.tapIndex,
          pickingOffset:1
        })
        that.getPickingData();
      }
    })
  },
  // 加载更多配货订单
  morePickingData(){
    let { pickingOffset,pickingNoMore} = this.data;
    if (pickingNoMore) return false;
    pickingOffset ++ ;
    this.setData({
      pickingOffset: pickingOffset,
    })
    this.getPickingData();
  },






  // 获取调货数据
  getDeployData(){
    let { query, deployOffset, deployType, deployData, deployNoData} = this.data;
    let newDeployData,newDeployNoData = false, newDeployNoMore = false;
    app.getData('/fashion/getDeployData', {
      query: query,
      type: deployType,
      offset: deployOffset,
      limit: 10
    }, (res) => {
      if (deployOffset == 1 && !res.orderList.length) {
        newDeployNoData = true;
      }
      if (deployOffset > 1) {
        newDeployData = deployData.concat(res.orderList);
      } else {
        newDeployData = res.orderList;
      }

      if (res.end) {
        newDeployNoMore = true;
      }
      this.setData({
        deployData: newDeployData,
        deployNoData: newDeployNoData,
        deployNoMore: newDeployNoMore
      });
    })

  },
  // 选择调货订单类型
  deployFilter() {
    let that = this;
    const { deployTypeList} = this.data;
    wx.showActionSheet({
      itemList: deployTypeList,
      itemColor: "#707070",
      success(res) {
        that.setData({
          deployType: res.tapIndex,
          deployOffset: 1,
          query:'',
          deployData:[]
        })
        that.getDeployData();
      }
    })
  },

  

    // 加载更多配货订单
  moreDeployData(){
    let { deployOffset, deployNoMore } = this.data;
    if (deployNoMore) return false;
    deployOffset ++ ;
    this.setData({
      deployOffset: deployOffset,
    })
    this.getDeployData();
  },

  // 查看订单详情
  checkDetail(e){
    const { ordertype,orderid} = e.currentTarget.dataset;

    wx.navigateTo({
      url: app.globalData.url['订单详情'] + "?orderType=" + ordertype + "&orderId=" + orderid,
    })
  }

})