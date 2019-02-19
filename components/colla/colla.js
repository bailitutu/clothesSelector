Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      value:''
    },
    content:{
      type:String,
      value:''
    },
    showContent:{
      type:Boolean,
      value:false,
    },
    showStatus:{
      type:Boolean,
      value:false,
    },
    noTopBorder:{
      type: Boolean,
      value: false,
    },
    isNoBorder:{
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow:false,
    rotateAnima:null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showTap(){
      const { isShow } = this.data;
      this.setData({
        isShow: !isShow
      })
    }
  }
})
