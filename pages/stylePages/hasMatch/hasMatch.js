var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query: '',
    noMore: false,
    noData: false,
    list: [],//页面数据
    selectList:[],//已选款式Id列表,
    allStyleList:[], //所有款式ID列表
    selAll:false,
    scrollH:0
  },
  onLoad(){
    let that = this;
    let query = wx.createSelectorQuery();
    query.select('#list_item').boundingClientRect(function (rect) {
      that.setData({
        scrollH: rect.height
      })
    }).exec()

  },
  onShow:function(){

    this.setData({
      query:'',
      selectList:[],
      allStyleList:[],
      selAll:false
    })
    this.getPageData();
  },

  getPageData() {
    let {  noData, query, list } = this.data;

    app.getData('/fashion/getHasMatchData', {
      styleName: query
    }, (res) => {
      let allStyleList = [];
      
      if (!res.hasMatchList.length) {
        noData = true;
      }else{
        noData = false;
        res.hasMatchList.map(function(item){
          item.hasSel = false;
          item.styleList.map(function(cell){
              cell.hasSel = false;
              if(allStyleList.indexOf(cell.id) < 0){
                allStyleList.push(cell.id)
              }

          })
        })
      }
      this.setData({
        noData: noData,
        noMore: true,
        list: res.hasMatchList,
        allStyleList: allStyleList
      })

    })
  },

  searchOrder(e) {
    this.setData({
      query: e.detail,
      noMore:false,
      list: []
    })
    this.getPageData();
  },


  // 选中店铺
  selectShop(e){
    const { index, select} = e.currentTarget.dataset;
    let {list,selectList} = this.data;

    if(!select){
      list[index].styleList.map((item) => {
        selectList.push(item.id);
      })
    }else{
      
      list[index].styleList.map((item) => {
        let ids = selectList.indexOf(item.id);
        selectList.splice(ids,1);
      })
    }
    
    this.doSelect(list,selectList);

  },


  // 选中单个款式
  selectStyle(e){
      const {id,select} = e.currentTarget.dataset;
      let { list, selectList } = this.data;
      if (!select){
        selectList.push(id);
      }else{
        let i = selectList.indexOf(id);
        selectList.splice(i,1);
      }
      this.doSelect(list, selectList);
  },

  //全选
  selectAll(){
    let { selAll, list, selectList, allStyleList} = this.data;
    if (!selAll){
      selectList = allStyleList;
    }else{
      selectList = []
    }
    this.doSelect(list, selectList);
    this.setData({
      selAll:!selAll
    })
  },


  // 联动
  doSelect(list, selectList){

    list.map((item)=>{
        item.hasSel = true;
        item.styleList.map((cell)=>{
          if (selectList.indexOf(cell.id) > -1 ){
            cell.hasSel = true;
          }else{
            cell.hasSel = false;
            item.hasSel = false;
          }
        })

    });

    this.setData({
      list:list,
      selectList: selectList
    })

  },


  //删除已匹配项
  deleteItem(){
    const { selectList } = this.data;
    let that = this;

    wx.showModal({
      title: '提示',
      content: '确认删除选中的款式吗？',
      success:function(resu){
        if(resu.confirm){
          app.submit('/fashion/delHasMacthStyle', {
            styleList: selectList,
            fbId: app.globalData.fbId
          }, (res) => {
            wx.showToast({
              title: '删除成功',
              success: function () {
                setTimeout(() => {
                  that.setData({
                    list: [],
                    noMore: false,
                    noData: false,
                    allSel: false,
                    selectList: [],
                    allStyleList: []
                  })
                  that.getPageData();
                }, 1500)
              }
            })
          })
        }
      }
    })
  },
  //重新匹配
  matchFn(){
    const { selectList } = this.data;
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定重新匹配？',
      success:function(data){
        if(data.confirm){
          app.submit('/fashion/matchAgain', {
            styleList: selectList,
            fbId: app.globalData.fbId,
          }, (res) => {
            wx.showToast({
              title: '提交成功',
              success: function () {
                setTimeout(() => {
                  that.setData({
                    list: [],
                    noMore: false,
                    noData: false,
                    allSel: false,
                    selectList: [],
                    allStyleList: []
                  })
                  that.getPageData();
                }, 1500)
              }
            })
          })
        }
      }
    })

    


  },


  //提交订单
  placeOrder(){
    const {selectList} = this.data;
    wx.navigateTo({
      url: '/pages/stylePages/orderDeal/orderDeal?selectList=' + selectList,
    })
  }
})