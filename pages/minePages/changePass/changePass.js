var  app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pwd:'',
    password:'',
    passwordTwo:'',
    isSubmit:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  inputPwd(e){
    this.setData({
      pwd:e.detail.value
    })
  },
  inputPassword(e) {
    this.setData({
      password: e.detail.value
    })
  },
  inputPassTwo(e) {
    this.setData({
      passwordTwo: e.detail.value
    })
  },
  submitFn(){
    const {pwd ,password ,passwordTwo} = this.data;
    if( !pwd || pwd == ''){
      wx.showToast({
        title: '请输入原密码',
        icon: 'none'
      })
      return false;
    }
    if (!app.isPassword(pwd)){
      wx.showToast({
        title: '原密码格式不正确',
        icon:'none'
      })
      return false;
    }
    if (!password || password == '') {
      wx.showToast({
        title: '请设置新密码',
        icon: 'none'
      })
      return false;
    }
    if (!passwordTwo || passwordTwo == '') {
      wx.showToast({
        title: '请再次输入新密码',
        icon: 'none'
      })
      return false;
    }
    if (!app.isPassword(password) || !app.isPassword(passwordTwo)) {
      wx.showToast({
        title: '新密码格式不正确',
        icon: 'none'
      })
      return false;
    }
    if (password !== passwordTwo ) {
      wx.showToast({
        title: '两次输入的新密码不一致',
        icon: 'none'
      })
      return false;
    }

    this.setData({
      isSubmit:true
    })
    app.submit('/loginApi/updatePassword',{
      pwd: pwd,
      password:password,
      passwordTwo:passwordTwo,
      type:1,
      userId:app.globalData.fbId
    },(res)=>{
        this.setData({
          isSubmit: false
        })
        wx.showToast({
          title: '修改成功',
          success(){
            setTimeout(()=>{
              wx.navigateBack();
            },2000)
          }
        })

    },()=>{
      this.setData({
        isSubmit:false
      })
    })

  }


 
})