// components/footerItem/footerItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showBtnOne:{
      type:Boolean,
      value:false
    },
    showDel: {
      type: Boolean,
      value: false
    },
    selAll: {
      type: Boolean,
      value: false
    },
    btnTwoDiable: {
      type: Boolean,
      value: false
    },
    btnOneText:{
      type:String,
      value:'重新匹配'
    },
    btnTwoText: {
      type: String,
      value: '提交订单'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    selAll:false,
    showDel:false,
    showBtnOne:false,
    showBtnTwo:false,
    btnTwoDiable:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeSel(){
      this.setData({
        selAll:!this.data.selAll
      })      
      this.triggerEvent('_selAllTap');
    },
    delTap(){
      this.triggerEvent('_delTap');
    },
    btnOneTap(){
      this.triggerEvent('_btnOneTap');
    },
    btnTwoTap(e){
      const { btnTwoDiable} = this.data;
      if (btnTwoDiable){
        return false;
      }
      this.triggerEvent('_btnTwoTap');
    }
  }
})
