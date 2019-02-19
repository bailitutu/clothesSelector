//app.js
App({
  onLaunch: function () {
  },
  globalData: {
    openId:null,
    labelList:[],
    sizeTypeList:[],
    styleTypeList:[],
    fbId:'',
    // httpUrl:'http://mock.eolinker.com/AuZV6UQ7a72b16740136ea3f42e1c0ea41f7cf87a3a5417?uri=',
    httpUrl:'https://www.xuanfuai.com/api/user',
    // httpUrl:'http://192.168.10.8:8040/api/user',
    url:{
      "登录": "/pages/minePages/login/login",
      "忘记密码": "/pages/minePages/forgetPass/forgetPass",
      "修改密码": "/pages/minePages/changePass/changePass",
      "设置密码": "/pages/minePages/setPass/setPass",
      "订单详情":"/pages/orderPages/orderDetail/orderDetail",
      "商户详情":"/pages/shopPages/shopDetail/shopDetail",
      "库存预警":"/pages/shopPages/stockList/stockList",
      "缺少单款单色":"/pages/shopPages/lackList/lackList",
      "未匹配":"/pages/stylePages/noMatch/noMatch",
      "已匹配":"/pages/stylePages/hasMatch/hasMatch",
      "待审核":"/pages/stylePages/waitCheck/waitCheck",
      "未通过":"/pages/stylePages/noPass/noPass",
      "已通过":"/pages/stylePages/hasPass/hasPass",
      "款式详情":"/pages/stylePages/styleDetail/styleDetail",
      "统计图表":"/pages/shopPages/collectList/collectList",
     
    }
  },

  submit(url,data,callback,fail){
    wx.showLoading({
      title: '请稍候...',
      mask: true
    })
    let that = this;
    wx.request({
      url: this.globalData.httpUrl + url,
      data:data,
      method:"POST",
      success(res){
        wx.hideLoading();
        if (res.data.head.respCode === '0000000'){
            if(callback){
              callback(res.data.body)
            }else{

            }
        } else if (res.data.head.respCode === '0000020') {
          wx.showToast({
            title: '您已被强制下线！',
            icon:'none',
            mask:true,
            success(){
              setTimeout(()=>{
                wx.redirectTo({
                  url: '/pages/minePages/login/login',
                })
              },2000)
            }
          })
          that.globalData.fbId = '';
        } else{
          wx.showToast({
            title:res.data.head.respContent ,
            icon:'none',
            mask: true,
            duration: 2000,
            success(){
              if (fail){
                fail(res);
              }
            }
          })
        }
      }
    })
  },

  getData(url,option,callback,fail){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this;
    wx.request({
      url: this.globalData.httpUrl + url,
      data: Object.assign({
        fbId:this.globalData.fbId
      }, option) ,
      method: "GET",
      success(res) {
        wx.hideLoading();
        if (res.data.head.respCode === "0000000") {
          if (callback) {
            callback(res.data.body)
          } 
        } else if (res.data.head.respCode === '0000020') {
          wx.showToast({
            title: '您已被强制下线！',
            icon: 'none',
            mask: true,
            success() {
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/minePages/login/login',
                })
              }, 2000)
            }
          })
          that.globalData.fbId = '';
        }  else {
          wx.showToast({
            title: res.data.head.respContent,
            icon: 'none',
            mask:true,
            duration: 2000,
            success() {
              if (fail) {
                fail(res);
              }
            }
          })
        }
      }
    })

  },

  getPageData(url, option, callback, fail) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: this.globalData.httpUrl + url,
      data:  option,
      method: "GET",
      success(res) {
        wx.hideLoading();
        if (res.data.head.respCode === "0000000") {
          if (callback) {
            callback(res.data.body)
          }
        } else if (res.data.head.respCode === '0000020') {
          wx.showToast({
            title: '您已被强制下线！',
            icon: 'none',
            mask: true,
            success() {
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/minePages/login/login',
                })
              }, 2000)
            }
          })
          that.globalData.fbId = '';
        }  else {
          wx.showToast({
            title: res.data.head.respContent,
            icon: 'none',
            mask: true,
            duration:2000,
            success() {
              if (fail) {
                fail(res);
              }
            }
          })
        }
      }
    })

  },

  goRe(type){
    wx.redirectTo({
      url: this.globalData.url[type],
    })
  },
  goNa(type){
    wx.navigateTo({
      url: this.globalData.url[type],
    })
  },
  isMoney(money) {
    let reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    let isMoney = reg.test(money);
    return isMoney;
  },
  isPhone(phone) {
    let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!phoneReg.test(phone)) {
      return false;
    } else {
      return true;
    }
  },
  isPassword(password){
    let pass = /[a-zA-Z0-9]{6,20}$/;
    if (!pass.test(password)){
      return false;
    }else{
      return true;
    }
  },

})