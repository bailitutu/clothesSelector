
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasSend:false,
    phone:'',
    code:'', //输入的验证码
    gotCode:'',//获取到的验证码,
    time:60
  },
  inputPhone(e){
    this.setData({
      phone:e.detail.value
    })
  },

  // 发送验证码
  sendCode(){
    const {phone} = this.data;
    if(!phone || phone == ""){
      wx.showToast({
        title: '手机号必填',
        icon:"none"
      })
      return false;
    } else if (!app.isPhone(phone)) {
      wx.showToast({
        title: '手机号错误',
        icon:"none"
      })
      return false;
    }
    this.setData({
      hasSend: true,
    })
    // 倒计时
    let time = 60;
    let timeUp ;
    timeUp = setInterval(() => {
      if (time > 0) {
        time--;
        this.setData({
          time: time
        })
      } else {
        clearInterval(timeUp);
        this.setData({
          time: 60,
          hasSend: false
        })
      }
    }, 1000)
    app.submit("/loginApi/sendCode", {phone:phone,type:1},(res)=>{
      this.setData({
        gotCode:res.random,
        fbId:res.fbId
      })
    },()=>{
      if (timeUp) {
        clearInterval(timeUp);
      } 
      this.setData({
        gotCode:'',
        time:60,
        hasSend:false
      })
    })
  },


  // 输入验证码
  inputCode(e){
    this.setData({
      code:e.detail.value
    })
  },

  // 下一步

  nextTap(){
    const { code, gotCode, fbId} = this.data;
    if (code != "" && gotCode != "" && code == gotCode){
      wx.navigateTo({
        url: '../setPass/setPass?fbId=' + fbId,
      })
    }else{
      wx.showToast({
        title: '验证码错误',
        icon:"none"
      })
    }

  }

})