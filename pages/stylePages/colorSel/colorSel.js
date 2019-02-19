var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    colorList:[],
    showSub:false,//是否显示子色系,
    selColor:'',
    selColorId:'',
    selColorName:'',
    subColorList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getColorList();
  },
  // 获取颜色列表
  getColorList(){
    wx.showNavigationBarLoading();
    app.getData('/fashion/getColorList',{},
    (res)=>{
      this.setData({
        isReady:true,
        colorList:res.colorList
      })
      wx.hideNavigationBarLoading();
    },()=>{
      wx.hideNavigationBarLoading();
    })
  },
  // 选择色系
  selectMainColor(e){
    const {colorList} = this.data;
    const { index} = e.currentTarget.dataset;

    this.setData({
      showSub:true,
      subColorList: colorList[index].subList
    })
  },
  // 选择色值
  selectColor(e){
    const { index, colorid } = e.currentTarget.dataset;
    let { subColorList, selColorId } = this.data;

    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 3];
    let { colorList} = prevPage.data;
    let colorHasSel = false;
    for( let i in colorList ){
      if(colorList[i].id == colorid){
        colorHasSel = true;
        wx.showToast({
          title: '颜色已添加过，请另选！',
          icon:'none',
          mask:true,
          duration:2500
        })
        break;
      }
    }
    if (colorHasSel){
      return false;
    }
    if (colorid == selColorId){
      this.setData({
        selColor: '',
        selColorId: '',
        selColorName: '',
      })
      return;
    }
    this.setData({
      selColor: subColorList[index].color,
      selColorId: subColorList[index].id,
      selColorName: subColorList[index].colorName,
    })
  },

  // 取消选择
  cancelSel(){
    this.setData({
      showSub:false,
      selColor: '',
      selColorId: '',
      selColorName: ''
    })
  },

  // 确定选择
  submitSel(){
    const { selColor,
      selColorId,
      selColorName} = this.data;

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      colorName: selColorName,
      colorVal: selColor,
      colorId: selColorId
    })
    wx.navigateBack();

  }


})