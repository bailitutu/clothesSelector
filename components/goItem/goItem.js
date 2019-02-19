// components/goItem/goItem.js
var app = getApp();
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      value:''
    },
    target:{
      type:String,
      value:''
    }
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
    go(e){
      const { target} = e.currentTarget.dataset;
      app.goNa( target);
    } 
  }
})
