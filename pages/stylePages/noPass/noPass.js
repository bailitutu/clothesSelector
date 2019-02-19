var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query:'',
    list:[],
    noData:false,
    noMore:false,
    delIdArr:[] ,//要删除的Id列表
    scrollH: 0
  },
  onLoad() {
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
    this.setData({
      query:'',
      delIdArr:[]
    })
      this.getPageData();
  },
  // 获取页面数据
  getPageData(){
    let { noData,query} = this.data;
    app.getData('/fashion/getNoRefuseData',{
      styleName:query
    },(res)=>{
        if (!res.noRefuseList.length){
          noData = true;
        } else {
          noData = false;
        }
        // 添加是否选中
        let list = res.noRefuseList;
        list.map((item)=>{
          item.hasSel = false;
        });
        this.setData({
          list: list,
          noData: noData,
          noMore:true
        })

    })
  },

  // 搜索
  searchOrder(e){
    this.setData({
      noMore: false,
      query: e.detail,
      list:[],
      delIdArr: [],
    })
    this.getPageData();
  },

  // 选中采购单
  selectTap(e){
    let { id, index} = e.currentTarget.dataset;
    let { delIdArr, list} = this.data;

    list[index].hasSel = !list[index].hasSel;

    // 判断是否在删除数组中
    if (delIdArr.indexOf(id) > -1){
      let idx = delIdArr.indexOf(id);
      delIdArr.splice(idx, 1);
    }else{
      delIdArr.push(id)
    }
    this.setData({
      list:list,
      delIdArr: delIdArr
    })
  },
  // 全选
  selAllTap(){

    let { delIdArr, list} = this.data;
    if (delIdArr.length == list.length){
      delIdArr = [],
      list.map((item) => {
        item.hasSel = false;
      })
    }else{
      list.map((item)=>{
        item.hasSel = true;
        // 判断是否在删除数组中
        if (delIdArr.indexOf(item.id) < 0) {
          delIdArr.push(item.id)
        }
      })
    }

    this.setData({
      list: list,
      delIdArr: delIdArr
    })

  },
  // 删除采购单
  deleteOrder(){
    const { delIdArr } = this.data;

    const that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除？',
      success(res){
        if(res.confirm){
          app.submit('/fashion/delNoRefuseOrder', {
            examineId: delIdArr,
            fbId: app.globalData.fbId
          }, (res) => {
            wx.showToast({
              title: '删除成功',
              success(){
                setTimeout(()=>{
                  that.setData({
                    list: [],
                    delIdArr: []
                  });
                  that.getPageData();
                },1500)
              }
            })
          })
        }

      }
    })
  },

  // 修改款式
  editStyle(e){
    const { id} = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/stylePages/styleDetail/styleDetail?styleId='+ id,
    })

  },
  // 修改供应商信息
  editSupply(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/stylePages/orderDeal/orderDeal?examineId=' + id,
    })

  }






  

 
})