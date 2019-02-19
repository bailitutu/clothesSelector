var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    styleTypeId:1,
    sizeTypeId:'',
    colorName:'',
    colorVal:'',
    colorId:'',
    sizeList:[]  //尺码列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      styleTypeId: options.styleTypeId,
      sizeTypeId: options.sizeTypeId
    })
    this.getSizeData();
  },

  getSizeData(){
    wx.showNavigationBarLoading();
    const { styleTypeId, sizeTypeId} = this.data;
    app.getData('/fashion/getStyleSize',{
      styleTypeId: styleTypeId,
      sizeTypeId: sizeTypeId
    },(res)=>{
      
      let sizeList = res.sizeList;
      sizeList.map((item)=>{
        item.subList.map((cell)=>{
          cell.value = ''
          
        })
        item.subList.push({
          name:'件数',
          value:0,
          id:'-1'
        })
      })
      this.setData({
        sizeList: sizeList
      })
      wx.hideNavigationBarLoading();
    },()=>{
      wx.hideNavigationBarLoading();
    })

  },

  // 绑定输入

  changeVal(e){
    const { sizeindex, index} = e.currentTarget.dataset;
    let { sizeList} = this.data;
    let curr = 'sizeList[' + sizeindex+'].subList['+ index +'].value';
    this.setData({
      [curr]: e.detail.value
    })
  },

  // 失去焦点
  inputBlur(e){
    const { id, sizeindex, index} = e.currentTarget.dataset;
    let { sizeList } = this.data;
    if(id == '-1' && e.detail.value == ''){
      let curr = 'sizeList[' + sizeindex + '].subList[' + index + '].value';
      this.setData({
        [curr]: 0
      })
    }
  },

  // 选择颜色
  selectColor(){
    wx.navigateTo({
      url: '/pages/stylePages/colorSel/colorSel',
    })
  },
  // 确认设置颜色及尺寸
  submit(){
    const { colorName,
      colorVal,
      colorId,
      sizeList} = this.data;
      
    //验证
    if(colorId =='' || !colorId)
    {
      wx.showToast({
        title: '请选择颜色',
        icon:'none'
      })
      return false;
    }



    wx.showModal({
      title: '提示',
      content: '确定选好了？',
      success: function (res) {
        if (res.confirm) {
          let colorLists = {};

          colorLists.colorName = colorName;
          colorLists.color = colorVal;
          colorLists.id = colorId;
          colorLists.sizeList = [];
          colorLists.total = 0;
          sizeList.map((item) => {
            let sizeItem = {};
            sizeItem.subList = [];
            for (var i = 0; i < item.subList.length - 1; i++) {
              sizeItem.subList.push({
                id: item.subList[i].id,
                val: item.subList[i].value
              })
            }

            sizeItem.sizeId = item.id;
            sizeItem.sizeName = item.typeName;
            sizeItem.sizeNum = item.subList[item.subList.length - 1].value;
            colorLists.total += parseInt(sizeItem.sizeNum);
            colorLists.sizeList.push(sizeItem)
          })
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2];
          let { colorList } = prevPage.data;
          colorList.push(colorLists);
          prevPage.setData({
            colorList: colorList,
          })
          wx.navigateBack();
        }
      }
    })
  }
})