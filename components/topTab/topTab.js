// components/topTab/topTab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabOne:{
      type:String,
      value:''
    },
    tabTwo:{
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    current:"1",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _tabTap(e){
      const { current } =  e.currentTarget.dataset;
      this.setData({
        current : current
      })
      this.triggerEvent('tabTap');
    }
  }
})
