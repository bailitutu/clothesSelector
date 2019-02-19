var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    styleId:null,
    isReady:false,
    pageInfo:{},
    storeList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      styleId:options.id
    })
    this.getPageData();
  },

  getPageData(){
    const { styleId} = this.data;
    wx.showNavigationBarLoading();
    app.getData('/fashion/getHasPassStyleDetail',{
      styleId:styleId
    },(res)=>{
        let storeList = res.storeList; 

        storeList.map(function(item){
          let total = 0;
          
          item.colorList.map(function(cell){
              total += Number(cell.colorNum);
          })
          item.storeColorNum = total;
        })


        this.setData({
        pageInfo:res,
        storeList:storeList,        
        isReady:true
      })

      wx.hideNavigationBarLoading();
    },()=>{
      this.setData({
        isReady: true
      })
      wx.hideNavigationBarLoading();
    })
  }

})