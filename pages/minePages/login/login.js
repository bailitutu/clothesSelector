// pages/minePages/login/login.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPass:false,
    password:'',
    userName:'',
    isSubmit:false //是否正在提交
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      
  },
  // 输入账号
  inputAccount(e){
    this.setData({
      userName:e.detail.value
    })
  },

  // 输入密码
  inputPass(e){
    this.setData({
      password:e.detail.value
    })
  },
  // 显示密码
  showPassHandle(){
    this.setData({
      showPass:!this.data.showPass
    })
  },
// 登录
  submitTap(){
    const { isSubmit, userName, password} = this.data;
    
    if(!isSubmit){
      if( userName == "" || !userName){
        wx.showToast({
          title: '请先输入账号',
          icon: 'none',
        })
        return false;
      }
      if (password == "" || !password) {
        wx.showToast({
          title: '密码不能为空',
          icon: 'none',
        })
        return false;
      }


      this.setData({
        isSubmit:true
      })
      app.submit('/loginApi/login',
        {
          account: this.data.userName,
          password: this.data.password,
          type:1
        },
        (res) => {
          this.setData({
            isSubmit : false
          })
          wx.setStorageSync('xksUserId', res.userId);
          app.globalData.fbId = res.userId;
          wx.switchTab({
            url: '/pages/stylePages/index/index',
          })
 
        },(error)=>{
          this.setData({
            isSubmit: false
          })
        }

      )
    }
  },
  
  forgetPass(){
    app.goNa("忘记密码");
  }
  
})