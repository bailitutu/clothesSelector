var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isReady:false,
    examineId:'',
    selectList:[],//提交的款式Id
    styleList:[], //款式列表,
    depotInfo:[],//仓库信息
    depotList:[],//仓库列表
    depotName:'', //仓库名称
    totalPrice:0,//采购总额,
    supplyName: '',//	厂家名称
    supplyPeople: '',//厂家负责人
    supplyAddress: '',//	厂家地址
    supplyPhone: '',//	厂家电话
    depotId: '',//	仓库Id
    paymentWay: '1',//	付款方式1微信2支付宝3银行卡支付
    wechat: '',//微信二维码
    alipay: '', //	支付宝二维码图片
    bank:'', //银行名称
    cardNumber:'', //卡号
    cardPeople:'',//持卡人
    telephone:'',//持卡人电话
    paymentDays: 0, //账期：0 ：现付；30：一个月,具体天数直接填数字；
    ewmImg:'',//二维码图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.selectList){
      this.setData({
        selectList: options.selectList.split(',')
      })
      this.getStyleData();
    }
    if (options.examineId){
      this.setData({
        examineId: options.examineId
      })
      this.getPageData();
    }
  },
  /**
   * 未提交过
   * 获取上一页面选择的款式信息；
   */
  getStyleData(){
    const { selectList} = this.data;
    app.getData('/fashion/placeOrder',{
      styleList: selectList,
      fbId:app.globalData.fbId
    },(res)=>{
      let depotList = [];
      if (res.depotList.length){
        res.depotList.map(function (item) {
          depotList.push(item.wareName);
        })
      }
      this.setData({
        isReady:true,
        styleList:res.styleList,
        totalPrice: res.totalPrice,
        depotList:depotList,
        depotInfo:res.depotList
      })
    })
  },

  // 修改商户信息时获取页面数据
  getPageData(){
    const { examineId } = this.data;
    app.getData('/fashion/getPurchaseData', {
      examineId: examineId,
      fbId: app.globalData.fbId
    }, (res) => {
      let depotList = [];
      let depotName = '';
      if (res.depotList.length) {
        res.depotList.map(function (item) {
          depotList.push(item.wareName);
            depotName = item.wareName
          if(item.id == res.depotId){
            depotName = item.wareName
          }
        })
      }
      let ewmImg = '';
      if (res.paymentWay == '1'){
        ewmImg = res.wechat
      } else if (res.paymentWay == '2'){ 
        ewmImg = res.alipay
      }
      this.setData({
        isReady: true,
        styleList: res.styleList,
        totalPrice: res.totalPrice,
        depotList: depotList,
        depotInfo: res.depotList,
        depotName: depotName, //仓库名称
        supplyName: res.supplyName,//	厂家名称
        supplyPeople: res.supplyPeople,//厂家负责人
        supplyAddress: res.supplyAddress,//	厂家地址
        supplyPhone: res.supplyPhone,//	厂家电话
        depotId: res.depotId,//	仓库Id
        paymentWay: res.paymentWay,//	付款方式1微信2支付宝3银行卡支付
        wechat: res.wechat,//微信二维码
        alipay: res.alipay, //	支付宝二维码图片
        bank: res.bank, //银行名称
        cardNumber: res.cardNumber, //卡号
        cardPeople: res.cardPeople,//持卡人
        telephone: res.telephone,//持卡人电话
        paymentDays: res.paymentDays, //账期：0 ：现付；30：一个月,具体天数直接填数字；
        ewmImg: ewmImg,//二维码图片
      })
    })
  },
  // 选择仓库
  selectDepot(){
    const { depotList, depotInfo} = this.data;
    const that = this;
    wx.showActionSheet({
      itemList: depotList,
      success: function (res) {
        that.setData({
          depotName: depotList[res.tapIndex],
          depotId: depotInfo[res.tapIndex].id
        })
      },
    })
  },

  // 输入
  changeInput(e){
    const { param} = e.currentTarget.dataset;
    this.setData({
      [param]:e.detail.value
    })
  },
  // 选择支付方式
  selectPayWay(e){
    const { val} = e.currentTarget.dataset;
    this.setData({
      paymentWay:val
    })

  },

  // 选择付款时间
  selectPayTime(e){
    const { val} = e.currentTarget.dataset;
    this.setData({
      paymentDays:val
    })
  },
  // 上传图片
  uploadImg(){
    // const { ewmImg } = this.data;
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function (res) {
        var imageSrc = res.tempFilePaths[0]

        wx.uploadFile({
          url: app.globalData.httpUrl +'/upload/uploadFile',
          filePath: imageSrc,
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            if (data.head.respCode === '0000000') {
              that.setData({
                ewmImg:data.body.uploadFilePath
              })

            } else {
              wx.showToast({
                title: '上传失败，请重新上传！',
              })
            }
          },
          fail: function ({errMsg}) {
            console.log('uploadImage fail, errMsg is', errMsg)
          }
        })

      },
      fail: function ({ errMsg }) {
        console.log('chooseImage fail, err is', errMsg)
      }
    })

  },
  // 提交订单
  submitOrder(){
    const that = this;
    let { 
      selectList,
      totalPrice,
      supplyName,
      supplyPeople,
      supplyAddress,
      supplyPhone,
      depotId,
      paymentWay,
      wechat,
      alipay,
      bank,
      cardNumber,
      examineId,
      cardPeople,
      telephone,
      paymentDays,
      ewmImg
    } = this.data;

     
    if (!depotId || depotId == ''){
      wx.showToast({
        title: '请选择收货仓库',
        icon:'none'
      })
      return false;
    }
    if (!supplyName || supplyName == '') {
      wx.showToast({
        title: '请输入厂家名称',
        icon: 'none'
      })
      return false;
    }
    if (!supplyPeople || supplyPeople == '') {
      wx.showToast({
        title: '请输入厂家负责人',
        icon: 'none'
      })
      return false;
    }
    if (!supplyAddress || supplyAddress == '') {
      wx.showToast({
        title: '请输入厂家地址',
        icon: 'none'
      })
      return false;
    }
    if (!supplyPhone || supplyPhone == '') {
      wx.showToast({
        title: '请输入厂家联系方式',
        icon: 'none'
      })
      return false;
    }
    if (supplyPhone.length < 7){
      wx.showToast({
        title: '厂家联系方式格式错误',
        icon: 'none',
        mask: true
      })
      return false;
    }
    if (supplyPhone.length == 11 ){
      if (!app.isPhone(supplyPhone)) {
        wx.showToast({
          title: '厂家联系方式格式错误',
          icon: 'none',
          mask: true
        })
        return false;
      }
    }


    switch (paymentWay) {
      case '1':
        if (!ewmImg){
          wx.showToast({
            title: '请先上传付款二维码图片',
            icon: 'none'
          })
          return false;
        }
        wechat = ewmImg;

        that.setData({
          wechat: ewmImg
        })
        break;
      case '2':
        if (!ewmImg) {
          wx.showToast({
            title: '请先上传付款二维码图片',
            icon: 'none'
          })
          return false;
        }
        alipay = ewmImg;

        that.setData({
          alipay: ewmImg
        })
        break;
      case '3':
        if (!bank || bank == '') {
          wx.showToast({
            title: '请输入收款银行',
            icon: 'none'
          })
          return false;
        }
        if (!cardNumber || cardNumber == '') {
          wx.showToast({
            title: '请输入收款卡号',
            icon: 'none'
          })
          return false;
        }
        if (!cardPeople || cardPeople == '') {
          wx.showToast({
            title: '请输入持卡人',
            icon: 'none'
          })
          return false;
        }
        if (!telephone || telephone == '') {
          wx.showToast({
            title: '请输入持卡人联系方式',
            icon: 'none'
          })
          return false;
        } 
        if ( !app.isPhone(telephone)) {
          wx.showToast({
            title: '手机号错误',
            icon: 'none'
          })
          return false;
        }
      default:
        wx.showToast({
          title: '付款方式不存在',
          icon: 'none'
        })
        break;
    }
    app.submit('/fashion/submitOrder',{
      selectList: selectList,//提交的款式Id
      totalPrice: totalPrice,//采购总额,
      supplyName: supplyName,//	厂家名称
      supplyPeople: supplyPeople,//厂家负责人
      supplyAddress: supplyAddress,//	厂家地址
      supplyPhone: supplyPhone,//	厂家电话
      depotId: depotId,//	仓库Id
      paymentWay: paymentWay,//	付款方式1微信2支付宝3银行卡支付
      wechat: wechat,//微信二维码
      alipay: alipay, //	支付宝二维码图片
      bank: bank, //银行名称
      cardNumber: cardNumber, //卡号
      cardPeople: cardPeople,//持卡人
      telephone: telephone,//持卡人电话
      paymentDays: paymentDays, //账期：0 ：现付；30：一个月,具体天数直接填数字；
      fbId:app.globalData.fbId,
      examineId: examineId
    },(res)=>{
        wx.showToast({
          title: '提交成功！',
          success:function(){
            setTimeout(function(){
              wx.switchTab({
                url: '/pages/stylePages/index/index',
              })
            },1500)
          }
        })
    })
  }

})