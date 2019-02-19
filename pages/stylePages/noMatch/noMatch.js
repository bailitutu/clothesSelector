var app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query:'',
    noData:false,
    noMore:false,
    list:[], //未匹配的款式
    selectList:[],//删除的/提交的/重新匹配的
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
      selectList: []
    })
    this.getPageData();  
  },

  getPageData(){
    let { query,noData,noMore} = this.data;

    app.getData('/fashion/getNoMatchData', {
      styleName: query
    }, (res) => {
      if (!res.styleList.length) {
        noData = true;
      }else{
        noData = false;
      }
      // 添加是否选中
      let list = res.styleList;
      list.map((item) => {
        item.hasSel = false;
      });
      this.setData({
        list: list,
        noData: noData,
        noMore: true
      })
    })
  },
  // 搜索
  searchOrder(e) {
    this.setData({
      noMore: false,
      query: e.detail,
      list: [],
      selectList: [],
    })
    this.getPageData();
  },

  // 选中款式
  selectTap(e) {
    let { id, index } = e.currentTarget.dataset;
    let { selectList, list } = this.data;

    list[index].hasSel = !list[index].hasSel;

    // 判断是否在删除数组中
    if (selectList.indexOf(id) > -1) {
      let idx = selectList.indexOf(id);
      selectList.splice(idx, 1);
    } else {
      selectList.push(id)
    }
    this.setData({
      list: list,
      selectList: selectList
    })
  },
  // 全选
  selAllTap() {

    let { selectList, list } = this.data;
    if (selectList.length == list.length) {
      selectList = [],
        list.map((item) => {
          item.hasSel = false;
        })
    } else {
      list.map((item) => {
        item.hasSel = true;
        // 判断是否在删除数组中
        if (selectList.indexOf(item.id) < 0) {
          selectList.push(item.id)
        }
      })
    }

    this.setData({
      list: list,
      selectList: selectList
    })

  },

  // 删除款式
  deleteStyle(){
    const { selectList } = this.data;
    let that = this;
    app.submit('/fashion/delNoMatchStyle', {
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
              selectList: []
            })
            that.getPageData();
          },1500)

        }
      })

    })


  },
  // 开始匹配
  startMatch(){
    const { selectList,list} = this.data;
    let disable = true;
    for (let sel in selectList) {
      if( disable ){
        for (let li in list) {
          if (selectList[sel] == list[li].id && list[li].styleNum == 0) {
            wx.showToast({
              title: '参与匹配的款式数量不能为0',
              icon: 'none',
              mask: true
            })
            disable = false;
            break;
          }
        }
      }else{
        break;
      }
    }

    if(!disable){
      return false;
    }

    wx.showLoading({
      title: '匹配中...',
      mask:true
    })
    let that = this;
    app.submit('/fashion/submitStyleMatch',{
      styleList: selectList,
      fbId:app.globalData.fbId
    },(res)=>{
      wx.hideLoading();
      wx.showToast({
        title: '匹配成功',
        success:function(){
          setTimeout(()=>{
            that.setData({
              list:[],
              noMore:false,
              selectList:[]
            })
            that.getPageData();
          },1500)

        }
      })

    },()=>{
      wx.hideLoading();
    })

  },
  // 修改款式
  editTap(e){
    const {id} = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/stylePages/styleDetail/styleDetail?styleId=' + id,
    })
  
  }






})