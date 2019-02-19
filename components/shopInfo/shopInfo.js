// components/shopInfo/shopInfo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    leftText:{
      type:String,
      value:''
    },
    shopName: {
      type: String,
      value: ''
    },
    shopImg: {
      type: String,
      value: ''
    },
    shopAddress: {
      type: String,
      value: ''
    },
    shopPeo: {
      type: String,
      value: ''
    },
    shopPhone: {
      type: String,
      value: ''
    },
    currentStatus: {
      type: String,
      value: ''
    },
    showLeft:{
      type:Boolean,
      value:false,
    },
    showPeo: {
      type: Boolean,
      value: false,
    },
    showRightStatus: {
      type: Boolean,
      value: false,
    },
    showFooterStatus: {
      type: Boolean,
      value: false,
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
