var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    styleId:'',//款式Id （修改款式时用）
    lock:false,//为解决长按事件bug；
    imgList:[],//款式图片列表
    styleName:'' ,//款式名称
    buyPrice: '',//	采购价
    wholesalePrice: '',//批发价
    retailPrice: '',//零售价
    styleTypeList: '',//所有款式分类的数组
    styleTypeId:'',//款式分类Id;
    isCollocation:false ,//是否百搭
    colorList:[] ,//颜色尺码
    labelList:[] ,//选款师定位
    multiArray: [] ,//款式分类数组；
    multiIndex: [0, 0, 0],//款式分类下标
    styleDetailList:[] ,//款式详情数组
    sizeTypeId:'', //选择的尺码Id
    sizeTypeIndex:0, //尺码下标
    sizeTypeList:[], //尺码分类集合（供选择）
    sizeTypeArray:[],//尺码分类数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.styleId) {
      this.setData({
        styleId: options.styleId
      })
      this.getStylePage();
    }else{
      this.setMultiArray();
    }
    
    this.selectCompo = this.selectComponent('#sel_1');
  },

  //修改款式获取款式信息

  getStylePage(){
    let { styleId,multiArray, multiIndex} = this.data;
    const styleList = app.globalData.styleTypeList;
    wx.showLoading({
      title: '加载中...',
    })
    app.getData('/fashion/getStyleData',{
      styleId:styleId,
      fbId:app.globalData.fbId
    },(res)=>{
      let selOneId = res.selStyleTypeOneId; //选择的款式分类Id
      let selTwoId = res.selStyleTypeTwoId; //选择的款式分类Id
      let selThreeId = res.selStyleTypeThreeId; //选择的款式分类Id
      for (var i = 0; i < styleList.length;i++){
        if (styleList[i].id == selOneId) {
            multiIndex[0] = i; 
            for (var j = 0; j < styleList[i].typeList.length;j++){
              if (styleList[i].typeList[j].id == selTwoId){
                multiIndex[1] = j; 
                for (var n = 0; n < styleList[i].typeList[j].typeList.length;n++ ){
                  if (styleList[i].typeList[j].typeList[n].id == selThreeId){
                    multiIndex[2] = n;
                    break; 
                  }
                }
                break;
              }
            }
          break;
        }
      }

  
      // 款式详情复原
      let styleDetailList = res.styleDetailList;
      styleDetailList.map((item) => {
        let list = [];
        item.dataList = [];
        item.labelSelId = item.selId;
        item.selIndex = 0;
        item.labelList.map((cell,i) => {
          list.push(cell.name)
          if(item.selId == cell.id){
            item.selIndex = i;
          }
        })
        item.dataList = list;
      })

      let sizeTypeList = [];
      res.sizeTypeArray.map((ite)=>{
        sizeTypeList.push(ite.name)
      })     
      this.setData({
        imgList:res.imgList,
        styleName:res.styleName,
        buyPrice:res.buyPrice,
        wholesalePrice: res.wholesalePrice,
        retailPrice: res.retailPrice,
        styleTypeId: res.selStyleTypeThreeId,
        sizeTypeId:res.selSizeTypeId,
        sizeTypeList: sizeTypeList,
        sizeTypeArray:res.sizeTypeArray,
        isCollocation: res.isCollocation,
        colorList:res.colorList,
        multiIndex: multiIndex,
        styleDetailList: styleDetailList
      })
      this.setMultiArray();      
      this.setSizeType();
      
      wx.hideLoading();      
    },()=>{
      wx.hideLoading();      
    })


  },

  //设置尺码分类
  setSizeType(){
    const { sizeTypeId,sizeTypeIndex,sizeTypeArray} = this.data;
    for(var i = 0;i<sizeTypeArray.length;i++){
      if (sizeTypeArray[i].id == sizeTypeId){
        this.setData({
          sizeTypeIndex:i
        })
        break;
      }
    }
  },

  // 设置款式分类三级联动和选款师定位
  setMultiArray(){
    let styleTypeList = app.globalData.styleTypeList;
    let { multiIndex } = this.data;
    let arr1 = [], arr2 = [], arr3 = [];
    styleTypeList.map(function (item) {
      arr1.push(item.typeName);
    });
    styleTypeList[multiIndex[0]].typeList.map(function (cell) {
      arr2.push(cell.typeName);
    })
    styleTypeList[multiIndex[0]].typeList[multiIndex[1]].typeList.map(function (li) {
      arr3.push(li.typeName);
    })
    this.setData({
      styleTypeList:app.globalData.styleTypeList,
      multiArray: [arr1, arr2, arr3],
      labelList:app.globalData.labelList
    })

  },

  bindMultiPickerChange: function (e) {
    const { styleTypeList} = this.data;

    if (!styleTypeList[e.detail.value[0]].typeList[e.detail.value[1]].typeList.length){
      wx.showToast({
        title: '分类缺失,请另选分类!',
        icon:'none',
        mask:true,
        duration:2500
      })
      return false;
    }
    let styleTypeId = styleTypeList[e.detail.value[0]].typeList[e.detail.value[1]].typeList[e.detail.value[2]].id;
    this.setData({
      styleTypeId: styleTypeId,
      multiIndex: e.detail.value,
      styleDetailList:[]
    })
    this.getStyleDetail();
  },
  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;

    let { styleTypeList} = this.data;
    switch (e.detail.column) {
      case 0:
        let arr1 = [];
        styleTypeList[e.detail.value].typeList.map((item)=>{
          arr1.push(item.typeName);
        })
        data.multiArray[1] = arr1;
        let arr2 = [];
        styleTypeList[e.detail.value].typeList[0].typeList.map((item) => {
          arr2.push(item.typeName);
        })
        data.multiArray[2] = arr2;
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        let arr3 = [];
        styleTypeList[data.multiIndex[0]].typeList[e.detail.value].typeList.map((item)=>{
          arr3.push(item.typeName)
        })
        data.multiArray[2] = arr3;
        data.multiIndex[2] = 0;
        break;
    }
    this.setData(data);
  },


  // 获取款式详情
  getStyleDetail(){
    const { styleTypeId,sizeTypeId } = this.data;
    wx.showLoading({
      title: '加载中...',
      icon:'loading'
    })
    app.getData('/fashion/getStyleLabelDetailList',{
      styleTypeId: styleTypeId
    },(res)=>{
      let dataList = res.styleLabelList;
      
      dataList.map((item)=>{
        let list = [];
        item.dataList =[];
        item.labelList.map((cell)=>{
            list.push(cell.name)
        })
        item.dataList = list;
      })
      // 获取尺码集合
      let sizeList = [];      
      let  sizeArr = res.sizeTypeList;
      if(sizeArr.length>0){
        sizeArr.map((item)=>{
          sizeList.push(item.name)
        })
      }
      this.setData({
        sizeTypeArray: sizeArr,
        sizeTypeList:sizeList,
        styleDetailList: dataList
      })

      if (sizeTypeId){
        this.setSizeType();
      }
      wx.hideLoading();
    })
  },
  // 添加款式图片
  addImg(){
    const that = this;
    let {imgList} = this.data;
    let len = 16- imgList.length;

    wx.chooseImage({
      count: len,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var imageSrc = res.tempFilePaths;
        wx.showLoading({
          title: '上传中...',
          icon:'loading',
          mask:true
        })
        that.uploadImg({
          url: app.globalData.httpUrl + '/upload/uploadFile',//这里是你图片上传的接口
          path: imageSrc,//这里是选取的图片的地址数组
        });
      },
      fail: function ({ errMsg }) {
        console.log('chooseImage fail, err is', errMsg)
      }
    })
  },

  // 上传图片

  uploadImg(data) {
    let that = this,
      i = data.i ? data.i : 0,//当前上传的哪张图片
      success = data.success ? data.success : 0,//上传成功的个数
      fail = data.fail ? data.fail : 0;//上传失败的个数

      let {imgList} = this.data;
      wx.uploadFile({
        url: data.url,
        filePath: data.path[i],
        name: 'file',//这里根据自己的实际情况改
        formData: null,//这里是上传图片时一起上传的数据
        success: (resp) => {
          success++;//图片上传成功，图片上传成功的变量+1
          var data = JSON.parse(resp.data);
          if (data.head.respCode === '0000000') {
      
            imgList.push({
              imgUrl: data.body.uploadFilePath
            });
            that.setData({
              imgList: imgList
            })
          }
    
        },
        fail: (res) => {
          fail++;
        },
        complete: () => {
          i++;//这个图片执行完上传后，开始上传下一张
          if (i == data.path.length) {   //当图片传完时，停止调用          
            wx.hideLoading();
            return false;
          } else {//若图片还没有传完，则继续调用函数
            data.i = i;
            data.success = success;
            data.fail = fail;
            that.uploadImg(data);
          }

        }
      });
  },

  // 移除图片
  removeImg(e){
    this.setData({ lock: true });
    const {index} = e.currentTarget.dataset;
    let { imgList } = this.data;    
    const that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success:function(res){
        if(res.confirm){
          imgList.splice(index, 1);
          that.setData({
            imgList: imgList
          })
        }
      }
    })

    return false;
  },

  // 预览图片

  previewImg(e){

    if (this.data.lock) {
      return;
    }
    const { index } = e.currentTarget.dataset;
    let { imgList } = this.data;
    const that = this;
    let urls = [];
    
    imgList.map(function(item){
        urls.push(item.imgUrl);
    }) 
    wx.previewImage({
      current: urls[index], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  // 处理长按bug
  touchEnd(){
    if(this.data.lock){
      setTimeout(() => {
        this.setData({ lock: false });
      }, 100);
    }
  },

  // 输入
  changeInput(e) {
    const { param } = e.currentTarget.dataset;
    this.setData({
      [param]: e.detail.value
    })
  },

  // 选择尺码
  selectSizeClick(){
    this.sizeType = this.selectComponent('#sel_sizeType');
    const labelIndex = this.sizeType.data.index;
    const { sizeTypeArray, colorList, sizeTypeIndex} = this.data;

    let sizeTypeId = sizeTypeArray[labelIndex].id;
    let that = this;
    if (colorList.length > 0 && labelIndex != sizeTypeIndex){
      wx.showModal({
        title: '温馨提示',
        content: '确定切换尺码分类吗？切换后颜色尺码将被清空！',
        success: (res) => {
          if (res.confirm) {
            that.setData({
              sizeTypeId: sizeTypeId,
              sizeTypeIndex: labelIndex,
              colorList: []
            })
          }else{
            this.sizeType.setData({
              index:sizeTypeIndex
            })
          }
        }
      })
      return  false;
    }else{
      this.setData({
        sizeTypeId: sizeTypeId,
        sizeTypeIndex: labelIndex,
        colorList: []
      })
    }
  },


  // 选择款式详情
  selectClick(e){
    const {index} = e.currentTarget.dataset;
    this.selectDetail = this.selectAllComponents('.sel_detail');
    const labelIndex = this.selectDetail[index].data.index;

    let {  styleDetailList} = this.data;
    styleDetailList[index].labelSelId = styleDetailList[index].labelList[labelIndex].id;
    styleDetailList[index].selIndex = labelIndex;
    
    this.setData({
      styleDetailList: styleDetailList
    })
  },

  // 是否百搭
  switchChange(e){
    this.setData({
      isCollocation: e.detail.value
    })
  },


  // 添加颜色尺码
  addColorSize(){
    const { styleTypeId,sizeTypeId } = this.data;
    if (!styleTypeId || styleTypeId == '') {
      wx.showToast({
        title: '请选择款式分类',
        icon: 'none'
      })
      return false;
    }
    // 尺码分类
    if (!sizeTypeId || sizeTypeId == '') {
      wx.showToast({
        title: '请选择尺码分类',
        icon: 'none'
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/stylePages/colorSet/colorSet?styleTypeId=' + styleTypeId + '&sizeTypeId=' + sizeTypeId,
    })
  },

  // 删除颜色尺码
  deleteColor(e){
    const { index } = e.currentTarget.dataset;
    let { colorList } = this.data;
    const that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success:function(res){
        if(res.confirm){
          colorList.splice(index, 1);
          that.setData({
            colorList: colorList
          })
        }
      }
    })
 
  },


  // 上传
  submit(){

    const { 
      styleId,
      imgList,
      styleName,
      buyPrice,
      wholesalePrice,
      retailPrice,
      styleTypeId,
      sizeTypeId,
      isCollocation,
      colorList,
      styleDetailList
    } = this.data;

    if (imgList.length == 0){
      wx.showToast({
        title: '请添加款式图片',
        icon: 'none'
      })
      return false ;
    }
    if (!styleName || styleName == '') {
      wx.showToast({
        title: '请输入款式名称',
        icon: 'none'
      })
      return false;
    }
    if (!buyPrice || buyPrice == '') {
      wx.showToast({
        title: '请输入款式采购价',
        icon: 'none'
      })
      return false;
    }
    if (!app.isMoney(buyPrice)){
      wx.showToast({
        title: '采购价金额错误',
        icon: 'none'
      })
      return false;
    }
    if (wholesalePrice.length > 0 && !app.isMoney(wholesalePrice)) {
      wx.showToast({
        title: '批发价金额错误',
        icon: 'none'
      })
      return false;
    }
    if (!retailPrice || retailPrice == '') {
      wx.showToast({
        title: '请输入款式零售价',
        icon: 'none'
      })
      return false;
    }
    if (!app.isMoney(retailPrice)) {
      wx.showToast({
        title: '零售价金额错误',
        icon: 'none'
      })
      return false;
    }
    if (!styleTypeId || styleTypeId== ''){
      wx.showToast({
        title: '款式分类必选',
        icon:'none'
      })
      return false;
    }
   


    // 获取款式详情Id列表
    let labelDetail=[];
    styleDetailList.map((item)=>{
      if (!item.labelSelId || item.labelSelId== '') {
        return false;
      }
      labelDetail.push({
        detailId:item.labelId,
        labelId: item.labelSelId
      })
    })
    if (labelDetail.length !== styleDetailList.length) {
      wx.showToast({
        title: '款式详情均必选',
        icon: 'none'
      })
      return false;
    }

    // 颜色尺码
    let colorSizeList = []; 
    if(colorList.length == 0){
      wx.showToast({
        title: '请添加颜色尺码',
        icon:'none'
      })
      return false;
    }
    colorList.map((cell)=>{
      let  colorCell = {};
      colorCell.colorId = cell.id || cell.colorId;
      colorCell.sizeList = cell.sizeList;
      colorSizeList.push(colorCell);
    })
    wx.showLoading({
      title: '上传中...',
    })
    app.submit('/fashion/submintAddStyle',{
      styleId: styleId,
      fbId:app.globalData.fbId,
      imgList: imgList,
      styleName: styleName,
      buyPrice: buyPrice,
      wholesalePrice: wholesalePrice,
      retailPrice: retailPrice,
      styleTypeId: styleTypeId,
      sizeTypeId: sizeTypeId,
      isCollocation: isCollocation,
      colorSizeList:colorSizeList,
      labelDetail: labelDetail
    },(res)=>{
        wx.hideLoading();
        wx.showToast({
          title: '添加成功！',
        })
        setTimeout(function(){
          wx.navigateBack();
        },1500)
    },()=>{
      wx.hideLoading();
    })


  }


 
})